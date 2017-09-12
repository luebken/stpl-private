const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const log = require('../lib/utils-log')
const ConsoleSLog = log.ConsoleSLog
const ConsoleSError = log.ConsoleSError

module.exports.resolveMain = (context, args) => {
  ConsoleSLog('resolveMain context: ', context)
  ConsoleSLog('resolveMain args: ', args)
  var params = {
    Bucket: 'stpl-data',
    Key: 'npms/npm/' + args.name
  }
  // main currently relies on npms
  return s3.getObject(params).promise().then(npmsData => {
    var npmsDataBody = JSON.parse(npmsData.Body.toString('utf-8'))
    var result = {
      source: ['npms'],
      name: npmsDataBody.collected.metadata.name,
      ecosystem: 'npm',
      repository: npmsDataBody.collected.metadata.links.repository
    }
    ConsoleSLog('resolveMain result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveMain:', err)
  })
}

module.exports.resolveLibrariesio = (context, args) => {
  ConsoleSLog('resolveLibrariesio context: ', context)
  ConsoleSLog('resolveLibrariesio args: ', args)
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'librariosio/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(librariosioData => {
    var librariosioDataBody = JSON.parse(librariosioData.Body.toString('utf-8'))
    var result = {
      metadata: {
        source: 'librariosio',
        last_modified: librariosioData.LastModified,
      },
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
    ConsoleSLog('resolveLibrariesio result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveLibrariesio:', err)
  })
}

module.exports.resolveVersioneye = (context, args) => {
  ConsoleSLog('resolveVersioneye context: ', context)
  ConsoleSLog('resolveVersioneye args: ', args)
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'versioneye/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(versioneyeData => {
    var versioneyeDataBody = JSON.parse(versioneyeData.Body.toString('utf-8'))

    var result = {
      metadata: {
        source: 'versioneye',
        last_modified: versioneyeData.LastModified,
      },
      name: versioneyeDataBody.name,
      language: versioneyeDataBody.language,
      description: versioneyeDataBody.description,
      version: versioneyeDataBody.version
    }
    ConsoleSLog('resolveVersioneye result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveVersioneye:', err)
  })
}

module.exports.resolveNpms = (context, args) => {
  ConsoleSLog('resolveNpms context: ', context)
  ConsoleSLog('resolveNpms args: ', args)

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
      metadata: {
        source: 'npms',
        last_modified: npmsData.LastModified,
      },
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
    ConsoleSLog('resolveNpms result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveNpms:', err)
  })
}

module.exports.resolveSnyk = (context, args) => {
  ConsoleSLog('resolveVersioneye context: ', context)('resolveVersioneye args: ', args)
  const pkg = args.name
  const ecosystem = 'npm'
  var params = {
    Bucket: 'stpl-data',
    Key: 'snyk/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(snykData => {
    var snykDataBody = JSON.parse(snykData.Body.toString('utf-8'))

    var result = {
      metadata: {
        source: 'snyk',
        last_modified: snykData.LastModified,
      },
      readme: snykDataBody.readme
    }
    ConsoleSLog('resolveSnyk result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveSnyk:', err)
  })
}

module.exports.resolveDaviddm = (context, args) => {
  ConsoleSLog('resolveDaviddm context: ', context)('resolveDaviddm args: ', args)

  const pkg = args.name
  const ecosystem = 'npm'

  var params = {
    Bucket: 'stpl-data',
    Key: 'daviddm/by-ep/' + ecosystem + '/' + pkg
  }
  return s3.getObject(params).promise().then(daviddmData => {
    var daviddmBody = JSON.parse(daviddmData.Body.toString('utf-8'))

    var result = {
      metadata: {
        source: 'daviddm',
        last_modified: daviddmData.LastModified,
      },
      status: daviddmBody.status,
      deps: daviddmBody.deps
    }
    ConsoleSLog('resolveDaviddm result:', result)
    return result
  }).catch(err => {
    ConsoleSError('Err in resolveDaviddm:', err)
  })
}
