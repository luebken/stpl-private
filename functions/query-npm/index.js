'use strict'

const utils = require('lib/utils-http')
const myS3 = require('lib/utils-s3')

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
// https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
//https://registry.npmjs.com/express/4.15.4
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  // TODO ignore if ecosystem != nodejs
  // const ecosystem = msg.ecosystem
  const pkg = msg.package

  const url = 'https://registry.npmjs.com/-/v1/search?text=' + encodeURIComponent(pkg) + '&size=1'

  utils.httpsGetJSON(url, function (err, json) {

    console.log('got json: ', json)

    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    if (json.total === 0) {
      console.log('0 results for pgk: ' + encodeURIComponent(pkg))
      mainCallback()
    } else {
      const key = 'npm/npm/' + json.objects[0].package.name
      myS3.SaveJsonToS3(key, json).then((msg) => {
        console.log('success: SaveJsonToS3 at key ' + key + ' msg:', msg)
        mainCallback()
      }).catch((err) => {
        console.log('error:', err)
        mainCallback(err)
      })
    }
  })
}
