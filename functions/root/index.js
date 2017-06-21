console.log('starting function')
exports.handle = function (e, ctx, cb) {
  console.log('processing event: %j', e)
  cb(null, {
    message: 'Welcome to Stpl API',
    version: 'pre-alpha',
    avialable_resources: [
      {
        path: '/component/{ecosystem}/{package}'
      }
    ]
  })
}
