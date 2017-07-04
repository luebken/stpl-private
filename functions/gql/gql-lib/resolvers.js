const AWS = require('aws-sdk')

module.exports.resolveComponent = (context, args) => {
  console.log('In resolver for compenent type. Context: ', context)
  console.log('args: ', args.name)

  const s3 = new AWS.S3()
  const pkg = args.name
  const ecosystem = 'npm'
  const key = 'librariosio/' + ecosystem + '/' + pkg
  var params = {
    Bucket: 'stpl-data',
    Key: key
  }
  return s3.getObject(params).promise().then(librariosioData => {
    var librariosioDataBody = JSON.parse(librariosioData.Body.toString('utf-8'))

    var result = {
      name: librariosioDataBody.name,
      ecosystem: librariosioDataBody.platform,
      latest_release: librariosioDataBody.latest_release_number,
      link: librariosioDataBody.homepage
    }
    console.log('result from resolveComponent ', result)
    return result
  })
}
