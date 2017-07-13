'use strict'

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
const utils = require('./lib/utils-http')
const myS3 = require('./lib/utils-s3')

exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  const ecosystem = msg.ecosystem
  const pkg = msg.package
  const repository = msg.repository

  console.log('would query for: ', ecosystem, pkg, repository)
  var repoParts = /.*github\.com\/(.*)\/(.*)/.exec(repository)
  if (repoParts) {
    var org = repoParts[1]
    var project = repoParts[2]

    const url = 'https://david-dm.org/' + org + '/' + project + '/info.json'

    utils.httpsGetJSON(url, function (err, json) {
      if (err != null) {
        console.log('error:', err)
        mainCallback(err)
      }
      const key = 'daviddm/' + org + '/' + project
      myS3.SaveJsonToS3(key, json).then((msg) => {
        console.log('success: SaveJsonToS3', msg)
        mainCallback()
      }).catch((err) => {
        console.log('error:', err)
        mainCallback(err)
      })
    })
  } else {
    console.err('Couldnt parse ', repository)
  }

  mainCallback()
}
