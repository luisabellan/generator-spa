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

    this._makeProgram();
    this._makeHasDS();
    this._makeRepoUrl();
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
    this.options.repoUrl = (this.options.repoUrl === 'true' || this.options.repoUrl === '') ? false : this.options.repoUrl;
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

    const copyOpts = { globOptions: { ignore: ignorePaths } };
    
    this.templateFiles.forEach((file) => {
      return this.fs.copyTpl(
        this.templatePath(file.src),
        this.destinationPath(file.dest || file.src),
        this.data,
        {},
        copyOpts
      );
    });
  }

  installing() {
    this.npmInstall();
  }

  end() {
    if (!fs.existsSync('.git')) {
      this.log(`================\nNow lets setup the git repo for ${this.options.repoUrl}.\n\n`);

      this.spawnCommandSync('git', ['init']);
      this.spawnCommandSync('git', ['checkout', '-b', 'main']);
      this.spawnCommandSync('git', ['add', '--all']);
      this.spawnCommandSync('git', ['commit', '-m', '"initial commit from labs spa generator"']);

      if (this.options.repoUrl) {
        this.spawnCommandSync('git', ['remote', 'add', 'origin', this.options.repoUrl]);
        this.log('pushing repo to github');
        this.spawnCommandSync('git', ['push', '-u', 'origin', 'main']);
      }
    }
  }
};
