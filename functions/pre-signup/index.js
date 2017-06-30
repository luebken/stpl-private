console.log('starting function')
exports.handle = function (e, ctx, cb) {
  console.log('processing event:', e)
  e.response.autoConfirmUser = true
  return cb(null, e)
}
