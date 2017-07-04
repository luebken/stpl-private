const https = require('https')
const AWS = require('aws-sdk')

module.exports.httpsGetJSON = (url, callback) => {
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

// callback: err, data
// send message
// in an case of an error just log the error. ignore.
module.exports.sendComponentRequest = function (ecosystem, pkg) {
  // TODO: always send a message and react accordingly: new vs update
  // publish a component query request
  console.log('sendComponentRequest for :', ecosystem, pkg)
  var sns = new AWS.SNS()
  var message = { ecosystem: ecosystem, package: pkg }
  sns.publish({
    Message: JSON.stringify(message),
    TopicArn: 'arn:aws:sns:us-east-1:339468856116:stpl-component-request'
  }, function (err, data) {
    if (err) {
      console.log('err when trying to publish event')
    }
  })
}
