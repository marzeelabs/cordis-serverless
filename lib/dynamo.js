var Promise = require('bluebird');
var AWS = require('aws-sdk');
var DynamoDBWrapper = require('dynamodb-wrapper');
var Attr = require('dynamodb-data-types').AttributeValue;

// @todo take config from serverless.yml
const config = {
  region: 'eu-west-1'
};
const docClient = new AWS.DynamoDB.DocumentClient(config);
const projectsTable = 'cordis_projects';
const organizationsTable = 'cordis_organizations';

const dynamoDB = new AWS.DynamoDB({
  // disable AWS retry logic  to use wrapper retry logic
  maxRetries: 0,
  region: 'eu-west-1'
});

const dynamoDBWrapper = new DynamoDBWrapper(dynamoDB, {
  maxRetries: 6,
  retryDelayOptions: {
    base: 100
  }
});

dynamoDBWrapper.events.on('retry', function (e) {
  console.log(
    'An API call to DynamoDB.' + e.method + '() acting on table ' +
    e.tableName + ' was throttled. Retry attempt #' + e.retryCount +
    ' will occur after a delay of ' + e.retryDelayMs + 'ms.'
  );
});

dynamoDBWrapper.events.on('consumedCapacity', function (e) {
  console.log(
    'An API call to DynamoDB.' + e.method + '() consumed ' +
    e.capacityType, JSON.stringify(e.consumedCapacity, null, 2)
  );
});

module.exports.createOrganizations = (organizations) => {
  return new Promise(function(resolve, reject) {
    var organizationsFormatted = [];

    // Format organizations to a structure suitable for BatchWriteItem
    // @see http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
    for (var projectRcn in organizations) {
      var project = organizations[projectRcn];
      for (var i=0; i<project.length; i++) {
        var organization = project[i];

        // delete empty properties, as DynamoDB doesn't like that
        for (var att in organization) {
          if (organization.hasOwnProperty(att) && !organization[att]) {
            delete organization[att];
          }
        }

        if (organization.projectRcn && organization.id) {
          organizationsFormatted.push({
            PutRequest: {
              Item: Attr.wrap(organization)
            }
          });
        }
        else {
          console.log("WRONG ITEM: ");
          console.log(organization);
        }
      }
    }

    var params = {
      RequestItems: {
        "cordis_organizations": organizationsFormatted
      }
    }

    // performs all Puts/Deletes in the array
    // promise resolves when all items are written successfully,
    // or rejects immediately if an error occurs
    dynamoDBWrapper.batchWriteItem(params, {
        // use configuration to control and optimize throughput consumption

        // write 10 items to MyTable every 500 milliseconds
        // this strategy is best if you have known, consistent item sizes
        "cordis_organizations": {
          partitionStrategy: 'EqualItemCount',
          targetItemCount: 10,
          groupDelayMs: 500
        }
    })
    .then(function (response) {
      // console.log(response);
      return resolve(response);
    })
    .catch(function (err) {
      // console.error(err);
      return reject(err);
    });
  });
}

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

        if (project.organizations) {
          delete project.organizations;
        }

        // if (project.organizations) {
        //   for (var i=0; i<project.organizations.length; i++) {
        //     for (var att2 in project.organizations[i]) {
        //       if (project.organizations[i].hasOwnProperty(att2) && !project.organizations[i][att2]) {
        //         delete project.organizations[i][att2];
        //       }
        //     }
        //   }
        // }
      }

      // Only consider projects with a set rcn
      if (project.rcn) {
        items.push({
          PutRequest: {
            Item: Attr.wrap(project)
          }
        });
      }
      else {
        // @todo log errors properly
        console.log("Wrong item (missing rcn): ");
        console.log(project);
      }
    }

    var params = {
      RequestItems: {
        "cordis_projects": items
      }
    }

    // performs all Puts/Deletes in the array
    // promise resolves when all items are written successfully,
    // or rejects immediately if an error occurs
    dynamoDBWrapper.batchWriteItem(params, {
        // use configuration to control and optimize throughput consumption
        // write 10 items to MyTable every 500 milliseconds
        // this strategy is best if you have known, consistent item sizes
        "cordis_projects": {
          partitionStrategy: 'EqualItemCount',
          targetItemCount: 10,
          groupDelayMs: 500
        }
    })
    .then(function (response) {
      return resolve(response);
    })
    .catch(function (err) {
      return reject(err);
    });
  });
}

// For use in DynamoDB
module.exports.getProjects = (args) => {
  return new Promise(function(resolve, reject) {

    console.log(args);

    var params = {
      TableName: projectsTable
    };
    if (args.rcn) {
      console.log("PARAMETERS SET!!", args.rcn);
      params.KeyConditionExpression = "rcn = :rcn";
      params.ExpressionAttributeValues = {
        ":rcn": args.rcn
      };
      console.log(params);

      docClient.query(params, function(err, data) {
        if (err) return reject(err);
        // console.log("Found " + data["Items"].lenght + " items");
        return resolve(data["Items"]);
      });

    }
    else {
      docClient.scan(params, function(err, data) {
        if (err) return reject(err);
        console.log("Found " + data["Items"].lenght + " items");
        return resolve(data["Items"]);
      });
    }


    // var params = {
    //   TableName: projectsTable,
    //   AttributesToGet: [
    //     'rcn',
    //     'reference',
    //     'acronym',
    //     'frameworkProgramme',
    //     'title'
    //   ]
    // };
  });
}

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
