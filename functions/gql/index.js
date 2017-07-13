'use strict'

const G = require('graphql')
const schema = require('./gql-lib/schema')
const sns = require('./lib/utils-sns')

function runQuery (query, claims, variables) {
  return G.graphql(schema.Schema, query, { claims: claims }, null, variables)
}

module.exports.handle = (event, context, cb) => {
  console.log('Received event', JSON.stringify(event))
  const userInfo = event.requestContext.authorizer.claims
  console.log(`Event from user ${userInfo.name} with ID ${userInfo.sub}`)

  const request = JSON.parse(event.body)
  console.log('Query: ', request.query)
  console.log('Variables: ', request.variables)

  return runQuery(request.query, userInfo, request.variables)
    .then(response => {
      // TODO differentiate: missing / updated
      // one reason is to limit the API calls
      // but also enable new datasources
      // AND: let the listeners listen and decide for themselves
      sns.publishMissingComponentEvent(request.variables.ecosystem, request.variables.name)

      console.log('Query finished. Errors: ', response.errors)
      console.log('Query finished. Data: ', response.data)

      var result = {
        statusCode: 0, // TBD below
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: '' // TBD below
      }
      if (response.errors && response.errors.length > 0) {
        // if at least one data is present return
        if (response.data.librariesio != null | response.data.versioneye != null | response.data.npms != null) {
          result.statusCode = 200
          result.body = JSON.stringify(response.data)
        } else {
          result.statusCode = 404
          result.body = JSON.stringify(response.errors)
        }
      } else { // no errors
        result.statusCode = 200
        result.body = JSON.stringify(response.data)
      }
      console.log('Built result: ', result)
      return result
    })
    .then(response => {
      console.log('calling callback with response: ', response)
      cb(null, response)
    })
    .catch(err => {
      console.log('err after runQuery ' + err)
      cb(err)
    })
}
