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
    latest_release_number: { type: G.GraphQLString },
    keywords: { type: new G.GraphQLList(G.GraphQLString) }
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

// NPMS
const npmsType = new G.GraphQLObjectType({
  name: 'npms',
  fields: {
    collected: {
      type:
      new G.GraphQLObjectType({
        name: 'collected',
        fields: () => ({
          metadata: {
            type:
            new G.GraphQLObjectType({
              name: 'metadata',
              fields: () => ({
                name: { type: G.GraphQLString },
                version: { type: G.GraphQLString },
                description: { type: G.GraphQLString },
                keywords: { type: new G.GraphQLList(G.GraphQLString) },
                links: {
                  type: new G.GraphQLObjectType({
                    name: 'links',
                    fields: () => ({
                      homepage: { type: G.GraphQLString },
                      repository: { type: G.GraphQLString }
                    })
                  })
                }
              })
            })
          }
        })
      })
    },
    evaluation: {
      type: new G.GraphQLObjectType({
        name: 'evaluation',
        fields: () => ({
          quality: {
            type: new G.GraphQLObjectType({
              name: 'quality',
              fields: () => ({
                carefulness: { type: G.GraphQLFloat },
                tests: { type: G.GraphQLFloat },
                health: { type: G.GraphQLFloat },
                branding: { type: G.GraphQLFloat }
              })
            })
          }
        })
      })
    }
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

// Snyk
const snykType = new G.GraphQLObjectType({
  name: 'snyk',
  fields: {
    readme: { type: G.GraphQLString }
  }
})
const snyk = {
  type: snykType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveSnyk
}

module.exports = {
  Librariesio: librariesio,
  Versioneye: versioneye,
  Npms: npms,
  Snyk: snyk
}
