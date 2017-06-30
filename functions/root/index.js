console.log('starting function')
exports.handle = function (e, ctx, cb) {
  console.log('processing event:', e)

  var response = {
    message: `Welcome ${e.requestContext.authorizer.claims.name} to Stpl API`,
    version: 'pre-alpha',
    body: e
  }

  cb(null, {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(response)
  })
}
