var tester = require('graphql-tester');

const test = tester.tester({
    url: 'https://tn2cf6x0di.execute-api.eu-west-1.amazonaws.com/dev/graphql'
});

test('{ project(rcn: 195886) { title, acronym } }')
	.then(function(response) {
		assert(response.success == true);
		// @todo fix test -- somehow always throws OK!
		assert(response.data.person.name == 'Luke Skywalker');
		console.log(response.data);
	});

