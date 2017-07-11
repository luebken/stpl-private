const AWS = require('aws-sdk')

module.exports.resolveLibrariesio = (context, args) => {
  console.log('In resolver for LibrariesIO Context: ', context)
  console.log('args: ', args.name)

  const s3 = new AWS.S3()
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'librariosio/' + ecosystem + '/' + pkg
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
      latest_release_number: librariosioDataBody.latest_release_number,
      keywords: librariosioDataBody.keywords
    }
    console.log('result from resolveLibrariesio: ', result)
    return result
  })
}

module.exports.resolveVersioneye = (context, args) => {
  console.log('In resolver for resolveVersionEye. Context: ', context)
  console.log('args: ', args.name)

  const s3 = new AWS.S3()
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'versioneye/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(versioneyeData => {
    var versioneyeDataBody = JSON.parse(versioneyeData.Body.toString('utf-8'))

    var result = {
      name: versioneyeDataBody.name,
      language: versioneyeDataBody.language,
      description: versioneyeDataBody.description,
      version: versioneyeDataBody.version
    }
    console.log('result from resolveVersionEye: ', result)
    return result
  })
}

module.exports.resolveNpms = (context, args) => {
  console.log('In resolver for resolveNpms. Context: ', context)
  console.log('args: ', args.name)

  const s3 = new AWS.S3()
  const pkg = args.name
  // const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'npms/npm/' + pkg
  }
  return s3.getObject(params).promise().then(npmsData => {
    var npmsDataBody = JSON.parse(npmsData.Body.toString('utf-8'))

    var result = {
      collected: {
        metadata: {
          name: npmsDataBody.collected.metadata.name,
          description: npmsDataBody.collected.metadata.description,
          version: npmsDataBody.collected.metadata.version,
          keywords: npmsDataBody.collected.metadata.keywords,
          links: {
            homepage: npmsDataBody.collected.metadata.links.homepage,
            repository: npmsDataBody.collected.metadata.links.repository
          }
        }
      },
      evaluation: {
        quality: {
          carefulness: npmsDataBody.evaluation.quality.carefulness,
          tests: npmsDataBody.evaluation.quality.tests,
          health: npmsDataBody.evaluation.quality.health,
          branding: npmsDataBody.evaluation.quality.branding
        }
      }
    }
    console.log('result from npms: ', result)
    return result
  })
}

module.exports.resolveSnyk = (context, args) => {
  console.log('In resolver for resolveSnyk. Context: ', context)
  console.log('args: ', args.name)

  const s3 = new AWS.S3()
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'snyk/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(snykData => {
    var snykDataBody = JSON.parse(snykData.Body.toString('utf-8'))

    var result = {
      readme: snykDataBody.readme
    }
    console.log('result from snyk: ', result)
    return result
  })
}
