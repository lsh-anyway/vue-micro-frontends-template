const path = require('path');
const inquirer = require('inquirer');
const {
    spawn
} = require('child_process');
const fuzzy = require('fuzzy');

const modules = require('../config/modules');

const probe = require('./probe');
const resolve = (...argvs) => path.join(__dirname, ...argvs);
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

class Serve {
    constructor() {
        this.questions = [{
            type: 'autocomplete',
            name: 'module',
            message: "请选择将要启动的模块：",
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
            console.log(`正在启动${module}`);
            if (module === '主模块') {
                this.serve(resolve('../APP'))
            } else {
                this.serve(resolve('../modules', module))
            }
        })
    };

    /**
     * 获取未启动的模块
     */
    async getChoices() {
        const opts = [];
        for (const name in modules) {
            if (name === 'next') continue;
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
     * 将模块作为子进程启动
     * @param {*} target
     */
    serve(target) {
        const childProcess = spawn('yarn', ['serve'], {
            cwd: target,
            shell: true,
            stdio: 'inherit'
        });
    };
}

new Serve();
