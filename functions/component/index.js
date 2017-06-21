console.log('starting function')

const AWS = require('aws-sdk')

exports.handle = function (e, ctx, mainCb) {
  var ecosystem = e.pathParameters.ecosystem.toLowerCase()
  var pkg = e.pathParameters.package.toLowerCase()

  const s3 = new AWS.S3()
  const key = 'librariosio/' + ecosystem + '/' + pkg
  var params = {
    Bucket: 'stpl-data',
    Key: key
  }

  s3.getObject(params, function (err, librariosioData) {
    if (err) {
      console.log('Error from s3.getObject: ' + err + ' data:' + librariosioData)
      sendComponentRequest(ecosystem, pkg)

      const response = {
        statusCode: 404,
        body: JSON.stringify({
          message: "Sorry we couldn't find the package you are looking for. Please come back in a couple of seconds.",
          err: err
        })
      }
      mainCb(null, response)
      return
    }
    let librariosioDataBody = JSON.parse(librariosioData.Body.toString('utf-8'))
    console.log('Data from s3.getObject: ' + librariosioDataBody)

    const key = 'versioneye/' + ecosystem + '/' + pkg
    var params = {
      Bucket: 'stpl-data',
      Key: key
    }
    s3.getObject(params, function (err, versioneyeData) {
      let versioneyeDataBody = ''
      if (err) {
        console.log('Error from s3.getObject: ' + err + ' data:' + versioneyeData)
      } else {
        versioneyeDataBody = JSON.parse(versioneyeData.Body.toString('utf-8'))
        console.log('Data from s3.getObject: ' + librariosioDataBody)
      }
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          librariosio: librariosioDataBody,
          versioneye: versioneyeDataBody
        })
      }
      mainCb(null, response)
    })
  })
}

// callback: err, data
// send message
// in an case of an error just log the error. ignore.
var sendComponentRequest = function (ecosystem, pkg) {
  // TODO: always send a message and react accordingly: new vs update
  // publish a component query request
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
