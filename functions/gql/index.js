'use strict'

const G = require('graphql')
const schema = require('./gql-lib/schema')
const sns = require('lib/utils-sns')

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
      sns.publishMissingComponentEvent(request.variables.ecosystem, request.variables.name)
      if (response.errors && response.errors.length > 0) {
        const restified = {
          statusCode: 404,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(response.errors)
        }
        console.log('Built response ', restified)
        return restified
      } else {
        const restified = {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(response.data)
        }
        console.log('Built response ', restified)
        return restified
      }
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
