var Promise = require('bluebird');
var AWS = require('aws-sdk');

// @todo take config from serverless.yml
const dynamoConfig = {
  region:          'eu-west-1'
};
const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
const projectsTable = 'project';

module.exports.createProject = (project) => {
  return new Promise(function(resolve, reject) {
    // Let's remove empty properties, as DynamoDB has a problem with this
    for (var att in project) {
      if (project.hasOwnProperty(att) && !project[att]) {
        delete project[att];
      }
    }

    var params = {
      TableName: 'project',
      Item: project
    };

    docClient.put(params, function(err, data) {

      console.log(project);
      if (err) return reject(err);
      return resolve(data);
    });

  });
}

module.exports.createProjects = (projects) => {
  return new Promise(function(resolve, reject) {
    var items = [];

    for (var i=0; i<projects.length; ++i) {
      var project = projects[i];
      // Let's remove empty properties, as DynamoDB has a problem with this
      for (var att in project) {
        if (project.hasOwnProperty(att) && !project[att]) {
          delete project[att];
        }
      }

      items[i] = {
        PutRequest: { 
          Item: project
        }
      }
    }

    // Batch insert
    var params = {
      RequestItems: {
        projectsTable: items
      }
    }

    docClient.batchWrite(params, function(err, data) {
      if (err) { console.log(err); return reject(err) };
      return resolve(data);
    });

  });
}


// export function getPosts() {
//   return new Promise(function(resolve, reject) {
//     var params = {
//       TableName: postsTable,
//       AttributesToGet: [
//         'id',
//         'title',
//         'author',
//         'bodyContent'
//       ]
//     };

//     docClient.scan(params, function(err, data) {
//       if (err) return reject(err);
//       return resolve(data["Items"]);
//     });

//   });
// }

// export function getAuthor(id) {
//   return new Promise(function(resolve, reject) {
//     var params = {
//       TableName: authorsTable,
//       Key: {
//         id: id
//       },
//       AttributesToGet: [
//         'id',
//         'name'
//       ]
//     };

//     docClient.get(params, function(err, data) {
//       if (err) return reject(err);
//       return resolve(data["Item"]);
//     });

//   });
// }

// export function getAuthors() {
//   return new Promise(function(resolve, reject) {
//     var params = {
//       TableName: authorsTable,
//       AttributesToGet: [
//         'id',
//         'name'
//       ]
//     };

//     docClient.scan(params, function(err, data) {
//       if (err) return reject(err);
//       return resolve(data["Items"]);
//     });

//   });
// }

// export function getComments() {
//   return new Promise(function(resolve, reject) {
//     var params = {
//       TableName: commentsTable,
//       AttributesToGet: [
//         'id',
//         'content',
//         'author'
//       ]
//     };

//     docClient.scan(params, function(err, data) {
//       if (err) return reject(err);
//       return resolve(data["Items"]);
//     });

//   });
// }
