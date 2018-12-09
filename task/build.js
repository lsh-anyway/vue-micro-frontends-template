const path = require('path');
const inquirer = require('inquirer');
const {
  spawn
} = require('child_process');
const fuzzy = require('fuzzy');

const modules = require('../config/modules');
inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));
const resolve = (...argvs) => path.join(__dirname, ...argvs);

class Build {
  constructor() {
    this.questions = [{
      type: 'checkbox-plus',
      name: 'modules',
      message: "按空格选择将要打包的模块：",
      searchable: true,
      highlight: true,
      choices: [],
    }]
    this.init();
  }
  /**
   * 用于初始化类
   */
  async init() {
    await this.getChoices();
    const prompt = () => inquirer.prompt(this.questions).then(answers => {
      const {
        modules
      } = answers;
      if (modules.length === 0) {
        console.clear();
        console.log('请选择模块或Ctrl+C退出打包');
        prompt()
      } else {
        modules.forEach(module => {
          if (module === '主模块') {
            this.build(resolve('../APP'))
          } else {
            this.build(resolve('../modules', module))
          }
        });
      }
    })
    prompt()
  };
  /**
   * 获取可以打包的模块
   */
  async getChoices() {
    const opts = [];
    for (const name in modules) {
      if (name === 'next') continue;
      if (modules.hasOwnProperty(name)) {
        opts.push(name);
      }
    }
    this.questions[0].source = (answers, input) => {
      input = input || '';
      return new Promise(function (resolve) {
        const fuzzyResult = fuzzy.filter(input, opts);
        resolve(
          fuzzyResult.map(function (el) {
            return el.original;
          })
        );
      });
    }
  }
  /**
   * 将模块作为子进程打包
   * @param {*} target
   */
  build(target) {
    const childProcess = spawn('yarn', ['build'], {
      cwd: target,
      shell: true,
        stdio: 'inherit'
    });
  };
}

new Build();