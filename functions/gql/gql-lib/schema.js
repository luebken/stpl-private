'use strict'

const G = require('graphql')
const types = require('./types')

const rootQuery = new G.GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    librariesio: types.Librariesio,
    versioneye: types.Versioneye,
    npms: types.Npms,
    snyk: types.Snyk
  }
})

module.exports.Schema = new G.GraphQLSchema({
  query: rootQuery
})
