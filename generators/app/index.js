const BaseGenerator = require('../baseGenerator');
const klr = require('kleur');
const fs = require('fs');
const defaultFileList = require('./default-templates');
var path = require('path');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    const me = this;
    this.initialData = {
      includeCodeAnalysisBadge: false,
      includeCoverageBadge: false,
    };
    this.templateFiles = [].concat(defaultFileList);
    this.removePackages = ['kleur', 'yaml', 'prompts'];
    
    this.argument('name', {
      type: String,
      desc: 'Name of Project',
    });

    this._makePromptOption(
      'program',
      {
        type: 'list',
        message: 'What is the project type?',
        choices: [
          {
            name: 'Buid Weeks',
            value: 'bw',
          },
          {
            name: 'Labs',
            value: 'labs',
          },
        ],
        default: 'labs',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'Which program will this be used for: "bw" or "labs"',
      }
    );
    this._makePromptOption(
      'repoName',
      {
        type: 'input',
        message: 'Enter the Labs github repo name.',
        default: 'labs-project1',
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'name of your github repo',
      }
    );
    this._makePromptOption(
      'hasDS',
      {
        type: 'confirm',
        message: 'Does your project have Data Science team members?',
        default: false,
      },
      {
        type: Boolean,
        alias: 'd',
        desc: 'project has DS team members',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.blue(
        'SPA'
      )} generator!\nLets get started.\nInitializing for project ${klr.bold(
        this.options.name
      )}`
    );
    this._removePrompts();
    this.initialData.projectName = this.options.name;
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      this.answers = props;
      this.projectDirName =
        (this.initialData.projectName || props.projectName) + '-fe';
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    this.destinationRoot(path.join(this.destinationPath(), '/' + this.projectDirName));
    if (this.program === 'labs') {
      this.data.includeCodeAnalysisBadge = true;
      this.data.includeCoverageBadge = true;
    }
    if (!this.data.hasDS) {
      this.removePackages.push('plotly.js');
      this.removePackages.push('react-plotly.js');
    }
    if (this.data.program === 'bw') {
      this.removePackages.concat([
        '@okta/okta-react',
        '@okta/okta-signin-widget',
        '@storybook/addon-actions',
        '@storybook/addon-knobs',
        '@storybook/addon-notes',
        '@storybook/addons',
        '@storybook/storybook-deployer',
        'antd',
      ]);
    }
  }

  writing() {
    const ignorePaths = [];
    
    if (!fs.existsSync(this.projectDirName)) {
      fs.mkdirSync(this.projectDirName);
    }
    process.chdir(path.join(process.cwd(), this.projectDirName));
    if (this.data.program === 'labs') {
      this.templateFiles.push({ src: '.storybook/**', dest: '.storybook' });
      this.templateFiles.push({ src: 'amplify.yml' });
    } else {
      ignorePaths.push('**/stories/**');
      ignorePaths.push('**/styles/**');
      ignorePaths.push('**/utils/oktaConfig.js');
      ignorePaths.push('**/pages/Home/**');
      ignorePaths.push('**/__tests__/Home.test.js');
      ignorePaths.push('**/pages/ProfileList/**');
      ignorePaths.push('**/__tests__/ProfileListContainer.test.js');
      ignorePaths.push('**/pages/Login/**');
      ignorePaths.push('**/__tests__/LoginContainer.test.js');
      ignorePaths.push('**/__tests__/RenderExampleListPage.test.js');
      ignorePaths.push('**/__tests__/RenderHomePage.test.js');
      ignorePaths.push('**/__tests__/RenderProfileListPage.test.js');
    }

    if (!this.data.hasDS) {
      ignorePaths.push('**/ExampleDataViz/**');
    }

    this.templateFiles.forEach((file) => {
      return this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest || file.src),
        this.data,
        {},
        { globOptions: { ignore: ignorePaths } }
      );
    });
  }

  installing() {}
};
