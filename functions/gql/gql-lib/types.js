'use strict'

const resolvers = require('./resolvers')
const G = require('graphql')

// Libraries.io
const librariesioType = new G.GraphQLObjectType({
  name: 'librariesio',
  fields: {
    name: { type: G.GraphQLString },
    platform: { type: G.GraphQLString },
    description: { type: G.GraphQLString },
    homepage: { type: G.GraphQLString },
    repository_url: { type: G.GraphQLString },
    normalized_licenses: { type: new G.GraphQLList(G.GraphQLString) },
    rank: { type: G.GraphQLString },
    latest_release_published_at: { type: G.GraphQLString },
    latest_release_number: { type: G.GraphQLString }
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

// VersionEye
const versioneyeType = new G.GraphQLObjectType({
  name: 'versioneye',
  fields: {
    name: { type: G.GraphQLString },
    language: { type: G.GraphQLString },
    description: { type: G.GraphQLString },
    version: { type: G.GraphQLString }
  }
})
const versioneye = {
  type: versioneyeType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveVersioneye
}

/*
const collectedType = new G.GraphQLObjectType({
  name: 'collected',
  fields: {
    street: { type: G.GraphQLString }
  }
})
*/

var metadataType = new G.GraphQLObjectType({
  name: 'metadata',
  fields: () => ({
    name: { type: G.GraphQLString },
    description: { type: G.GraphQLString }
  })
})

var collectedType = new G.GraphQLObjectType({
  name: 'collected',
  fields: () => ({
    metadata: { type: metadataType }
  })
})

// NPMS
const npmsType = new G.GraphQLObjectType({
  name: 'npms',
  fields: {
    collected: { type: collectedType }
  }
})

const npms = {
  type: npmsType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveNpms
}

module.exports = {
  Librariesio: librariesio,
  Versioneye: versioneye,
  Npms: npms
}
