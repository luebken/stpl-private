const AWS = require('aws-sdk')
const s3 = new AWS.S3()

module.exports.resolveMain = (context, args) => {
  console.log('resolveMain. Context: ', context, 'Args: ', args)
  var params = {
    Bucket: 'stpl-data',
    Key: 'npms/npm/' + args.name
  }
  // main currently relies on npms
  return s3.getObject(params).promise().then(npmsData => {
    var npmsDataBody = JSON.parse(npmsData.Body.toString('utf-8'))
    var coreResult = {
      'source': ['npms'],
      'name': npmsDataBody.collected.metadata.name,
      'ecosystem': 'npm',
      'repository': npmsDataBody.collected.metadata.links.repository
    }
    console.log(JSON.stringify(coreResult))
    return coreResult
  }).catch(err => {
    console.error('Err in resolveMain:', err)
  })
}

module.exports.resolveLibrariesio = (context, args) => {
  console.log('resolveLibrariesio. Context: ', context, 'Args: ', args)

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
      source: 'librariosio',
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
    console.log(JSON.stringify(result))
    return result
  }).catch(err => {
    console.error('Err in resolveLibrariesio:', err)
  })
}

module.exports.resolveVersioneye = (context, args) => {
  console.log('resolveVersioneye. Context: ', context, 'Args: ', args)

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
      source: 'versioneye',
      name: versioneyeDataBody.name,
      language: versioneyeDataBody.language,
      description: versioneyeDataBody.description,
      version: versioneyeDataBody.version
    }
    console.log(JSON.stringify(result))
    return result
  }).catch(err => {
    console.error('Err in resolveVersioneye:', err)
  })
}

module.exports.resolveNpms = (context, args) => {
  console.log('resolveNpms. Context: ', context, 'Args: ', args)

  const s3 = new AWS.S3()
  const pkg = args.name
  var params = {
    Bucket: 'stpl-data',
    Key: 'npms/npm/' + pkg
  }
  return s3.getObject(params).promise().then(npmsData => {
    var npmsDataBody = JSON.parse(npmsData.Body.toString('utf-8'))

    var dependenciesAsArray = []
    for (var property in npmsDataBody.collected.metadata.dependencies) {
      dependenciesAsArray.push({ 'name': property, 'version': npmsDataBody.collected.metadata.dependencies[property] })
    }

    var result = {
      source: 'npms',
      collected: {
        metadata: {
          name: npmsDataBody.collected.metadata.name,
          description: npmsDataBody.collected.metadata.description,
          version: npmsDataBody.collected.metadata.version,
          keywords: npmsDataBody.collected.metadata.keywords,
          links: {
            homepage: npmsDataBody.collected.metadata.links.homepage,
            repository: npmsDataBody.collected.metadata.links.repository
          },
          license: npmsDataBody.collected.metadata.license,
          dependencies: dependenciesAsArray
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
    console.log(JSON.stringify(result))
    return result
  }).catch(err => {
    console.error('Err in resolveNpms:', err)
  })
}

module.exports.resolveSnyk = (context, args) => {
  console.log('resolveSnyk. Context: ', context, 'Args: ', args)

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
      source: 'snyk',
      readme: snykDataBody.readme
    }
    console.log(JSON.stringify(result))
    return result
  }).catch(err => {
    console.error('Err in resolveSnyk:', err)
  })
}

module.exports.resolveDaviddm = (context, args) => {
  console.log('resolveDaviddm. Context: ', context, 'Args: ', args)

  const s3 = new AWS.S3()
  const pkg = args.name
  const ecosystem = 'npm'

  var params = {
    Bucket: 'stpl-data',
    Key: 'daviddm/by-ep/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(daviddmData => {
    var daviddmBody = JSON.parse(daviddmData.Body.toString('utf-8'))

    var result = {
      source: 'daviddm',
      status: daviddmBody.status,
      deps: daviddmBody.deps
    }
    console.log(JSON.stringify(result))
    return result
  })
}
