const config = <% if (program === 'labs') { %>require('./src/styles/theme-overrides.js') <% } else { %>{}<% } %>;
const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: config,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
