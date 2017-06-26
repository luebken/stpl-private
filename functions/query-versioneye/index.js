'use strict'

const utilities = require('lib/utilities')
const AWS = require('aws-sdk')

const VERSIONEYE_API_KEY = process.env.VERSIONEYE_API_KEY

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  let ecosystem = msg.ecosystem
  const pkg = msg.package

  // versioneye specific mapping
  let product
  if (ecosystem === 'npm') {
    product = 'nodejs'
  } else {
    product = ecosystem
  }

  const url = 'https://www.versioneye.com/api/v2/products/' + product + '/' + encodeURIComponent(pkg) + '?api_key=' + VERSIONEYE_API_KEY

  utilities.httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    saveToS3(ecosystem, pkg, json).then((msg) => {
      console.log(msg)
      mainCallback()
    }).catch((err) => {
      console.log('error:', err)
      mainCallback(err)
    })
  })

  // Get JSON for url. returns promise
  var saveToS3 = (ecosystem, pkg, versionEyeResult) => new Promise((resolve, reject) => {
    const s3 = new AWS.S3()

    const key = 'versioneye/' + ecosystem + '/' + pkg
    var buf = new Buffer.from(JSON.stringify(versionEyeResult))

    var params = {
      Bucket: 'stpl-data',
      Key: key,
      ContentType: 'application/json',
      ACL: 'public-read',
      Body: buf
    }

    s3.putObject(params, function (err, data) {
      if (err) {
        console.log('Error from s3.putObject: ' + err, data)
        // callback(err, 'Error')
        reject(err)
      } else {
        console.log('Data from s3.putObject: ' + data)
        // callback(null, 'Data stored in S3')
        resolve('Data stored in S3')
      }
    })
  })
}
