import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

// import { getProject, getOrganizations } from './../lib/dynamo.js';
import { getProject } from './../lib/dynamo.js';

/**
 * The type of organization involved in the project.
 */
// const organizationEnumType = new GraphQLEnumType({
//   name: 'OrganizationEnumType',
//   description: 'A type of organization',
//   values: {
//     COORDINATOR: {
//       value: 1,
//       description: 'Main coordinator of the project.',
//     },
//     PARTICIPANT: {
//       value: 2,
//       description: 'Participant of the project.',
//     },
//   }
// });

/**
 * The main project type.
 */
const projectType = new GraphQLObjectType({
  name: 'Project',
  description: 'A project identified by a rcn.',
  fields: () => ({
    rcn: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The rcn.',
    },
    reference: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The reference.',
    },
    acronym: {
      type: GraphQLString,
      description: 'The acronym.',
    },
    frameworkProgramme: {
      type: GraphQLString,
      description: 'Framework programme.',
    },
    title: {
      type: GraphQLString,
      description: 'The title of the project.',
    },
    // organizations: {
    //   type: new GraphQLList(organizationType),
    //   description: 'The organizations involved in this project.',
    //   args: {
    //     type: {
    //       description: 'Type of the organization in the project. Can be either coordinator or participant.',
    //       type: organizationEnumType
    //     }
    //   },
    //   resolve: (project, type) => getOrganizations(project, type),
    // },
  }),
});

// const organizationType = new GraphQLObjectType({
//   name: 'Organization',
//   description: 'A organization',
//   fields: () => ({
//     name: {
//       type: GraphQLString,
//       description: 'The name of the project.',
//     },
//     location: {
//       type: GraphQLString,
//       description: 'The location of the project.',
//     },
//     type: {
//       type: organizationEnumType,
//       description: 'The type of organization'
//     }
//   }),
// });

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema. It gives us the ability to fetch
 * projects by their ID.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    project: {
      type: new GraphQLList(projectType),
      args: {
        rcn: {
          description: 'rcn of the project. If ommitted, returns all projects',
          type: GraphQLInt
        }
      },
      resolve: (root, { rcn }) => getProjects(rcn),
    },
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType
});
