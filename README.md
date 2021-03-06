# cordis-serverless
> Provides a clean and simple REST interface on top of [EU Cordis data](http://cordis.europa.eu/projects/home_en.html).

## Usage

* [GET projects](https://fwze5fzun2.execute-api.eu-west-1.amazonaws.com/production/projects): returns the first 100 projects from the Cordis database.

## About

This API uses the [serverless](https://serverless.com) framework on Amazon AWS. [What is a serverless architecture?](http://martinfowler.com/articles/serverless.html)

### Installation

Install [serverless](https://serverless.com) framework locally

	npm install -g serverless

Connect to your [Amazon AWS account](https://serverless.com/framework/docs/providers/aws/guide/credentials/), and then deploy

	serverless deploy

### AWS setup

DynamoDB streams [aren't managed by Serverless](https://serverless.com/framework/docs/providers/aws/events/streams/), so these have been set up through the UI.

### Endpoints

Example querying graphQL

	curl -X POST -H "Content-Type: application/json" -d '{"query": "{ project { rcn, title } }"}' https://5e5qfaxb1c.execute-api.eu-west-1.amazonaws.com/dev/graphql


### Test locally

You can invoke functions locally, like

	serverless invoke local -f getProjects

Debug function invokes like

	serverless logs -f getProjects

Count number of items in a DynamoDB table

	aws dynamodb scan --table-name=cordis_projects --select "COUNT"

## License

MIT © [Marzee Labs](http://marzeelabs.org)
