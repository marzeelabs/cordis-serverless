var db = require('./lib/dynamo');
var cp = require('cordis-parser');

import { graphql } from 'graphql';
import Schema from './graphql/schema';

module.exports.getProjects = (event, context, callback) => {
  cp.parseHorizon2020Projects(function(result) {
    // Slice the results until we introduce proper pagination
    var sliced = result.slice(0,100);
    const response = {
      statusCode: 200,
      body: JSON.stringify(sliced),
    };
    callback(null, response);
  });
};

module.exports.getOrganizations = (event, context, callback) => {
  cp.parseHorizon2020Organizations(function(result) {
    // Slice the results until we introduce proper pagination
    var sliced = result.slice(0,100);
    const response = {
      statusCode: 200,
      body: JSON.stringify(sliced),
    };
    callback(null, response);
  });
};

module.exports.populateDb = (event, context) => {
  cp.parseHorizon2020Projects(function(result) {
    db.createProjects(result)
      .then(function(content) {
        callback(null, "Processed " + result.length + "projects");
      })
      .catch(function(error) {
        // context.done(null, "Error processing projects: " + error.message);
        callback("Error processing projects: " + error.message);
      });
  });
}

module.exports.runGraphQL = (event, callback) => {
  let query = event.query;
  console.log('QUERY: ', query);

  // patch to allow queries from GraphiQL
  // like the initial introspectionQuery
  if (event.query && event.query.hasOwnProperty('query')) {
    query = event.query.query.replace("\n", ' ', "g");
  }

  graphql(Schema, query).then(function(result) {
    console.log('RESULT: ', result);
    return callback(null, result);
  });

}
