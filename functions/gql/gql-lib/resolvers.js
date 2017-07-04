const AWS = require('aws-sdk')

module.exports.resolveLibrariesio = (context, args) => {
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
      platform: librariosioDataBody.platform,
      description: librariosioDataBody.description,
      homepage: librariosioDataBody.homepage,
      repository_url: librariosioDataBody.repository_url,
      normalized_licenses: librariosioDataBody.normalized_licenses,
      rank: librariosioDataBody.rank,
      latest_release_published_at: librariosioDataBody.latest_release_published_at,
      latest_release_number: librariosioDataBody.latest_release_number
    }
    console.log('result from resolveLibrariesio: ', result)
    return result
  })
}
