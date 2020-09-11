# Labs Basic SPA Generator

The Labs SPA generator will create a [basic cra react app](https://docs.labs.lambdaschool.com/labs-spa-starter/) with configuration and
components in place based on answers to the prompts. Common elements found in
all configurations are:

- [Labs opinionated](https://docs.labs.lambdaschool.com/labs-spa-starter/components) project structure
- example page/common components
- [Working tests](https://docs.labs.lambdaschool.com/labs-spa-starter/testing) for components using jest and React Testing Library
- Labs defined eslint and pretter config
- github ci/actions workflow config
- git hook enforced linting using Husky

## CLI Examples

Create a SPA app for the labs 27 gigantic product

`labs spa labs27-gigantic`

Create a SPA app for the Labs 26 gigantic product with the `labs` program option

`labs spa labs26-gigantic --program-name=labs`

When only the project name argument is provided then you will be prompted
for more info.

![Labs SPA prompts](spa-prompts.png)

## Prompts / Options

The following prompts will provide additional configuration and examples

### Does your team have Data Science members

If the answer is `Y` then the following items will be added to the project:

- modules `plotly.js` and `react-plotly.js`
- an example data visualization page component `ExampleDataViz` using a DS API.

### Program

The program choices are `BW` and `Labs`

- `BW` will generate the base configuration.
- `Labs` will add the following elements
  - Okta identity management service
  - Secure routes using Okta library
  - Secure BE API example using Okta JWT
  - [Ant Design](https://docs.labs.lambdaschool.com/labs-spa-starter/styling-with-ant-design) configuration and theme
  - [Storybook](https://docs.labs.lambdaschool.com/labs-spa-starter/storybook) documentation
  - [AWS Amplify](https://docs.labs.lambdaschool.com/labs-spa-starter/untitled) config file

## Enter your Github repo HTTPS git url

This is the git https url (eg https://github.com/Lambda-School-Labs/gen-test-git.git)

When this value is provided then the generator will do the following:

- init the git repo with this URL as the remote
- create a main branch
- stage and commit the generated files
- push the branch to github
