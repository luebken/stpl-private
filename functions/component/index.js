console.log('starting function')

const AWS = require('aws-sdk')

exports.handle = function (e, ctx, cb) {
  var ecosystem = e.pathParameters.ecosystem.toLowerCase()
  var pkg = e.pathParameters.package.toLowerCase()

  const s3 = new AWS.S3()
  const key = 'librariosio/' + ecosystem + '/' + pkg
  var params = {
    Bucket: 'stpl-data',
    Key: key
  }

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log('Error from s3.getObject: ' + err + ' data:' + data)

      // publish a component query request
      var sns = new AWS.SNS()
      var message = { ecosystem: ecosystem, package: pkg }
      sns.publish({
        Message: JSON.stringify(message),
        TopicArn: 'arn:aws:sns:us-east-1:339468856116:stpl-component-request'
      }, function (err, data) {
        if (err) {
          console.log(err.stack)
          return
        }
        console.log('push sent')
        console.log(data)
      })

      const response = {
        statusCode: 404,
        body: JSON.stringify({
          message: "Sorry we couldn't find the package you are looking for. Please come back in a couple of seconds.",
          err: err
        })
      }
      cb(null, response)
      return
    }

    console.log('--- why ???')

    let objectData = JSON.parse(data.Body.toString('utf-8'))
    console.log('Data from s3.getObject: ' + objectData)
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        librariosio: objectData
      })
    }
    cb(null, response)
  })
}
