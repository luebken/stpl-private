const AWS = require('aws-sdk')

// callback: err, data
// send message
// in an case of an error just log the error. ignore.
module.exports.publishMissingComponentEvent = function (ecosystem, pkg) {
  // TODO: always send a message and react accordingly: new vs update
  // publish a component query request
  console.log('Publish ComponentEvent for :', ecosystem, pkg)
  var sns = new AWS.SNS()
  var message = { ecosystem: ecosystem, package: pkg }
  sns.publish({
    Message: JSON.stringify(message),
    TopicArn: 'arn:aws:sns:us-east-1:339468856116:stpl-missing-component'
  }, function (err, data) {
    if (err) {
      console.log('err when trying to publish event')
    }
  })
}