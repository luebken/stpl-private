'use strict'

const resolvers = require('./resolvers')
const G = require('graphql')

const librariesioType = new G.GraphQLObjectType({
  name: 'librariesio',
  fields: {
    name: {
      type: G.GraphQLString
    },
    ecosystem: {
      type: G.GraphQLString
    },
    latest_release: {
      type: G.GraphQLString
    },
    link: {
      type: G.GraphQLString
    }
  }
})

const librariesio = {
  type: librariesioType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveLibrariesio
}

module.exports = {
  Librariesio: librariesio
}
