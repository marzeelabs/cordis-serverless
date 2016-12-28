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
    id: {
      type: new gql.GraphQLNonNull(gql.GraphQLInt),
      description: 'The identifier.',
    },
    acronym: {
      type: gql.GraphQLString,
      description: 'The acronym.',
    },
    status: {
      type: gql.GraphQLString,
      description: 'The status.',
    },
    programme: {
      type: gql.GraphQLString,
      description: 'The programme.',
    },
    topics: {
      type: gql.GraphQLString,
      description: 'The topics.',
    },
    frameworkProgramme: {
      type: gql.GraphQLString,
      description: 'Framework programme.',
    },
    title: {
      type: gql.GraphQLString,
      description: 'The title of the project.',
    },
    startDate: {
      type: gql.GraphQLString,
      description: 'The start date of the project.',
    },
    endDate: {
      type: gql.GraphQLString,
      description: 'The end date of the project.',
    },
    projectUrl: {
      type: gql.GraphQLString,
      description: 'The project URL.',
    },
    objective: {
      type: gql.GraphQLString,
      description: 'The objective.',
    },
    fundingScheme: {
      type: gql.GraphQLString,
      description: 'The funding scheme.',
    },
    coordinator: {
      type: gql.GraphQLString,
      description: 'The coordinator.',
    },
    coordinatorCountry: {
      type: gql.GraphQLString,
      description: 'The country of the coordinator.',
    },
    participants: {
      type: gql.GraphQLString,
      description: 'The participants (separated by ;).',
    },
    participantCountries: {
      type: gql.GraphQLString,
      description: 'The countries of the participants (separated by ;).',
    },
    subjects: {
      type: gql.GraphQLString,
      description: 'The subject.',
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
