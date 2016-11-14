'use strict';

var cp = require('cordis-parser');

module.exports.getProjects = (event, context, callback) => {
  cp.parseHorizon2020(function(result) {
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
  console.log('triggered ' + event);
}
