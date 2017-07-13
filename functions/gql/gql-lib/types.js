'use strict'

const resolvers = require('./resolvers')
const G = require('graphql')

// Core data
// Data which is save to use.
const mainType = new G.GraphQLObjectType({
  name: 'main',
  fields: {
    name: { type: G.GraphQLString },
    ecosystem: { type: G.GraphQLString },
    repository: { type: G.GraphQLString }
  }
})
module.exports.Main = {
  type: mainType,
  args: {
    name: { type: G.GraphQLString }
  },
  resolve: resolvers.resolveMain
}

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
module.exports.Librariesio = {
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
module.exports.Versioneye = {
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
                },
                license: { type: G.GraphQLString },
                dependencies: {
                  type: new G.GraphQLList(new G.GraphQLObjectType({
                    name: 'dependencies',
                    fields: () => ({
                      name: { type: G.GraphQLString },
                      version: { type: G.GraphQLString }
                    })
                  }))
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

module.exports.Npms = {
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

module.exports.Snyk = {
  type: snykType,
  args: {
    name: { type: G.GraphQLString }
  },
  resolve: resolvers.resolveSnyk
}

// Daviddm
const daviddmType = new G.GraphQLObjectType({
  name: 'daviddm',
  fields: {
    status: { type: G.GraphQLString },
    deps: {
      type: new G.GraphQLList(new G.GraphQLObjectType({
        name: 'deps',
        fields: () => ({
          name: { type: G.GraphQLString },
          required: { type: G.GraphQLString },
          stable: { type: G.GraphQLString },
          latest: { type: G.GraphQLString },
          status: { type: G.GraphQLString }
        })
      }))
    }
  }
})

module.exports.Daviddm = {
  type: daviddmType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveDaviddm
}
