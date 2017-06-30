console.log('starting function')

const AWS = require('aws-sdk')
const utilities = require('lib/utilities')

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
      utilities.sendComponentRequest(ecosystem, pkg)

      const response = {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json'
        },
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
    // TODO do we need individual requests?
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          librariosio: librariosioDataBody,
          versioneye: versioneyeDataBody
        })
      }
      mainCb(null, response)
    })
  })
}
