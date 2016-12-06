var gql = require('graphql');
var dynamo = require('./../lib/dynamo');

/**
 * The main project type.
 */
const projectType = new gql.GraphQLObjectType({
  name: 'Project',
  description: 'A project identified by a rcn.',
  fields: () => ({
    rcn: {
      type: new gql.GraphQLNonNull(gql.GraphQLInt),
      description: 'The rcn.',
    },
    reference: {
      type: new gql.GraphQLNonNull(gql.GraphQLInt),
      description: 'The reference.',
    },
    acronym: {
      type: gql.GraphQLString,
      description: 'The acronym.',
    },
    frameworkProgramme: {
      type: gql.GraphQLString,
      description: 'Framework programme.',
    },
    title: {
      type: gql.GraphQLString,
      description: 'The title of the project.',
    }
  }),
});

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema. It gives us the ability to fetch
 * projects by their ID.
 */
const queryType = new gql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    project: {
      type: new gql.GraphQLList(projectType),
      args: {
        rcn: {
          description: 'rcn of the project. If ommitted, returns all projects',
          type: gql.GraphQLInt
        }
      },
      // resolve: (root, { rcn }) => dynamo.getProjects(rcn)
      resolve: (root, args) => dynamo.getProjects(args)
    }
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
// export const Schema = new GraphQLSchema({
//   query: queryType
// });
module.exports.Schema = new gql.GraphQLSchema({
  query: queryType
});
