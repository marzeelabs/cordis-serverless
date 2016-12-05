var cp = require('cordis-parser');
var gql = require('graphql');

var schema = require('./graphql/schema');
var db = require('./lib/dynamo');

// import { graphql } from 'graphql';
// import Schema from './graphql/schema';

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

module.exports.runGraphQL = (event, context, callback) => {

  try {
    // console.log(event.body)
    const body = JSON.parse(event.body);
    console.log("BODY", body);
    console.log('clean query', body.query);
    // const query = JSON.stringify(body.query);

    const query = body.query;
    // console.log('QUERY: ', query);
      // query = '{ project { rcn } }';
    console.log('QUERY: ', query);


    // patch to allow queries from GraphiQL
    // like the initial introspectionQuery
    // if (event.body.query && event.body.query.hasOwnProperty('query')) {
    //   query = event.body.query.query.replace("\n", ' ', "g");
    // }

    // console.log('QUERY AGAIN', query);

    gql.graphql(schema.Schema, query).then(function(result) {
      // console.log('RESULT: ', result);
      // console.log(result.data.project);
      // console.log(result);
      // for (var i=0; i<result.length; i++) {
      //   console.log(result[i]);
      // }

      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
      };

      return callback(null, response);
    });
  } catch (error) {
    // console.log('HAHAH');
    // console.log(error);

    const response = {
      statusCode: 200,
      body: 'Error: ' + error.message,
    };

    return callback(null, response);
  }

    // const response = {
    //   statusCode: 200,
    //   body: 'hello world'
    // };

    // return callback(null, response);

}
