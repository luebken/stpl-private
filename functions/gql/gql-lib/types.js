'use strict'

const resolvers = require('./resolvers')
const G = require('graphql')

const componentType = new G.GraphQLObjectType({
  name: 'Component',
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

const component = {
  type: componentType,
  args: {
    name: {
      type: G.GraphQLString
    }
  },
  resolve: resolvers.resolveComponent
}

module.exports = {
  Component: component
}
