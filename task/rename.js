const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const fuzzy = require('fuzzy');

const modules = require('../config/modules');
const proxy = require('../config/proxy');

const resolve = (...argvs) => path.join(__dirname, ...argvs);
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

class Rename {
  constructor() {
    this.opts = [];
    this.questions = [{
      type: 'autocomplete',
      name: 'module',
      message: "请选择将要重命名的模块：",
      source: undefined,
    }, {
      type: 'input',
      name: 'name',
      message: "请输入修改后的模块名",
      validate: undefined,
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
        module,
        name
      } = answers;
      const oldPath = resolve('modules', module);
      const newPath = resolve('modules', name);
      modules[`${name}`] = modules[`${module}`];
      modules[`${name}`].name = name;
      delete modules[module];
      proxy[`/${name}`] = proxy[`/${module}`];
      delete proxy[`/${module}`];
      fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
      fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
      fs.writeFileSync(resolve('modules', module.toString(), 'config.json'), JSON.stringify(modules[`${name}`]));
      this.rename(oldPath, newPath);
      console.log('重命名完成');
    })
  };
  /**
   * 获取模块
   */
  async getChoices() {
    const opts = [];
    for (const name in modules) {
      if (name === 'next') continue;
      if (name === '主模块') continue;
      if (modules.hasOwnProperty(name)) {
        opts.push(name);
      }
    }
    this.questions[0].source = function(answers, input) {
      input = input || '';
      return new Promise(function (resolve) {
        const fuzzyResult = fuzzy.filter(input, opts);
        const data = fuzzyResult.map(function (el) {
          return el.original;
        });
        resolve(data);
      });
    }
    this.questions[1].validate = function (value) {
      if (value.length === 0) {
        return '模块名不能为空';
      }
      if (/^\s*$/.test(value)) {
        return '请输入有效的模块名';
      }
      if (opts.includes(value.toString())) {
        return `${value}模块已存在`;
      }
      return true;
    }
  }
  /**
   * 重命名文件
   * @param {原文件} oldPath
   * @param {重命名文件} newPath
   */
  rename(oldPath, newPath) {
    fs.renameSync(oldPath, newPath);
  };
}

new Rename();
