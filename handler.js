var db = require('./lib/dynamo');
var cp = require('cordis-parser');


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

module.exports.populateDb = (event, context, callback) => {
  cp.parseHorizon2020Projects(function(result) {
    // Slice the results until we introduce proper pagination
    var sliced = result.slice(0,10);

    for (var i=0; i<sliced.length; ++i) {
      db.createProject(sliced[0]);
      console.log(sliced[0]);
    }
    // createProject()

  });
}
