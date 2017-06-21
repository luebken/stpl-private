'use strict'

const AWS = require('aws-sdk')
const utilities = require('lib/utilities')

const LIBRARIES_IO_API_KEY = process.env.LIBRARIES_IO_API_KEY

// Query and store a component in S3 /query/{ecosystem}/{package}
// Trigger via SNS
exports.handle = (event, context, mainCallback) => {
  var message = event.Records[0].Sns.Message
  console.log('Message received from SNS:', message)
  var msg = JSON.parse(message)
  const ecosystem = msg.ecosystem
  const pkg = msg.package

  const url = 'https://libraries.io/api/' + ecosystem + '/' + encodeURIComponent(pkg) + '?api_key=' + LIBRARIES_IO_API_KEY

  utilities.httpsGetJSON(url, function (err, json) {
    if (err != null) {
      console.log('error:', err)
      mainCallback(err)
    }
    saveToS3(json, function (err, message) {
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
var saveToS3 = (librariosioResult, callback) => {
  const s3 = new AWS.S3()

  const key = 'librariosio/' + librariosioResult.platform.toLowerCase() + '/' + librariosioResult.name.toLowerCase()
  var buf = new Buffer.from(JSON.stringify(librariosioResult))

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

/*
  const params = {
      TableName: process.env.DYNAMODB_TABLE_LIBRARIESIO,
      Item: librariosio_result,
    };

    dynamoDb.put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the item.'));
        return;
      }
*/
