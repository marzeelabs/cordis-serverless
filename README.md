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

### Test locally

You can invoke functions locally, like

	serverless invoke local -f getProjects

Debug function invokes like

	serverless logs -f getProjects

## License

MIT © [Marzee Labs](http://marzeelabs.org)
