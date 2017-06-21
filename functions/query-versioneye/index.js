'use strict'

const https = require('https')
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

  httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    saveToS3(ecosystem, pkg, json, function (err, message) {
      if (err != null) {
        console.log('error:', err)
        mainCallback(err)
      }
      console.log('sucess. stored json to s3')
      mainCallback()
    })
  })
}

// Get JSON for url. Calls callback with: err, message
var saveToS3 = (ecosystem, pkg, versionEyeResult, callback) => {
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
      callback(err, 'Error')
    } else {
      console.log('Data from s3.putObject: ' + data)
      callback(null, 'Data stored in S3')
    }
  })
}

// Get JSON for url. Calls callback with: err, json
var httpsGetJSON = (url, callback) => {
  console.log('Querying: ' + url)
  https.get(url, (response) => {
    const statusCode = response.statusCode
    const contentType = response.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\nStatus Code: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`)
    }
    if (error) {
      console.log('Error for https.get of: ' + url)
      console.log('Error message: ' + error.message)
      response.resume()
      return
    }

    response.setEncoding('utf8')
    let rawData = ''
    response.on('data', function (chunk) { rawData += chunk })
    response.on('end', () => {
      let parsedData
      try {
        parsedData = JSON.parse(rawData)
      } catch (e) {
        console.log('error parsing ' + rawData + '\nmsg:' + e.message)
      }
      callback(null, parsedData)
    })
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`)
  })
}
