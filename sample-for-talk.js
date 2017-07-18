const s3 = new AWS.S3()
const utils = new AWS.S3()

// some requires
exports.handle = function (e, ctx, mainCb) {
  var ecosystem = e.pathParameters.ecosystem.toLowerCase()
  var pkg = e.pathParameters.package.toLowerCase()

  s3.getObject({ Bucket: 'stpl-data', Key: ecosystem + '/' + pkg }, function (s3Err, data) {
    if (s3Err) {
      console.log('Error from s3.getObject: ' + s3Err + ' data:' + data)
      utils.sendComponentRequest(ecosystem, pkg)

      const response = {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'err': s3Err })
      }
      mainCb(s3Err, response)
      return
    }

    let body = JSON.parse(data.Body.toString('utf-8'))
    console.log('Data from s3.getObject: ' + body)
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: data })
    }
    mainCb(null, response)
  })
}
