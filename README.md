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

## Prompts / Options

The following options will provide additional configuration and examples

### Does your team have Data Science members?

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
