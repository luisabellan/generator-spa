const BaseGenerator = require('@lambdalabs/base-generator');
const klr = require('kleur');
const fs = require('fs');
const defaultFileList = require('./default-templates');
var path = require('path');
const { exit } = require('process');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
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
      'repoUrl',
      {
        type: 'input',
        message: 'What is your Github repo HTTPS git url',
        default: 'labs-project1',
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'The Github repo HTTPS git url. eg, https://github.com/lambda-school-labs/labsNN-productA-teamB-fe',
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
        type: (val) => { return (val==='false' ? false : true)},
        alias: 'd',
        desc: 'project has DS team members',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'SPA'
      )} generator!\nLets get started.\nInitializing for project ${klr.bold(
        this.options.name
      )}`
    );
    this._removePrompts();
    this.initialData.projectName = this.options.name;
    this.projectDirName = this.initialData.projectName + '-fe';
    this.destinationRoot(path.join(this.destinationPath(), '/' + this.projectDirName));
    this.options.repoUrl = (this.options.repoUrl === 'true' ? false : this.options.repoUrl);
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

  installing() {
    this.npmInstall();
  }

  end() {
    if (this.options.repoUrl) {
      this.log('================\nNow lets setup the git repo and make an initial commit.\n\n');

      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['checkout', '-b', 'main']);
      this.spawnCommandSync('git', ['remote', 'add', 'origin', this.options.repoUrl]);
      this.spawnCommandSync('git', ['add', '--all']);
      this.spawnCommandSync('git', ['commit', '-m', '"initial commit from labs spa generator"']);
      this.log('pushing repo to github');
      this.spawnCommandSync('git', ['push', '-u', 'origin', 'main']);
    }
  }
};
