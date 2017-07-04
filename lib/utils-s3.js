
const AWS = require('aws-sdk')

module.exports.SaveJsonToS3 = (key, json) => new Promise((resolve, reject) => {
  const s3 = new AWS.S3()

  var buf = new Buffer.from(JSON.stringify(json))

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
