const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const child_process = require('child_process');
const fuzzy = require('fuzzy');

const modules = require('../config/modules');
const proxy = require('../config/proxy');

const probe = require('../probe');
const resolve = (...argvs) => path.join(__dirname, ...argvs);
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));


const remove = (target) => {
  child_process.spawnSync('rm', ['-r', target]);
};

class Remove {
  constructor() {
    this.questions = [{
      type: 'autocomplete',
      name: 'module',
      message: "请选择将要删除的模块：",
      source: undefined,
    }]
    this.init();
  }
  /**
   * 用于初始化类
   */
  async init() {
    await this.getChoices();
    inquirer.prompt(this.questions).then(answers => {
      const {
        module
      } = answers;
      console.log(`开始删除模块${module}`);
      delete modules[module];
      delete proxy[`/${module}`];
      this.remove(resolve('modules', module.toString()));
      fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
      fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
      console.log(`已删除模块${module}`);
    })
  };
  /**
   * 获取未启动的模块
   */
  async getChoices() {
    const opts = [];
    for (const name in modules) {
      if (name === 'next') continue;
      if (name === '主项目') continue;
      if (modules.hasOwnProperty(name)) {
        const module = modules[name];
        const useable = await probe(module.port);
        if (useable) {
          opts.push(name);
        } else {
          console.log(`${name}已启动，或${module.port}端口被占用`)
        }
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
   * 删除子模块
   * @param {*} target
   */
  remove(target) {
    child_process.spawnSync('rm', ['-r', target]);
  };
}

new Remove();
