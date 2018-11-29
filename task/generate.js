const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const child_process = require('child_process');

const modules = require('../config/modules');
const proxy = require('../config/proxy');

const resolve = (...argvs) => path.join(__dirname, ...argvs);

class Generate {
    constructor() {
        this.opts = [];
        this.questions = [{
            type: 'input',
            name: 'name',
            message: "请输入模块名",
            validate: function (value) {
                if (value.length === 0) {
                    return '模块名不能为空';
                }
                if (/^\s*$/.test(value)) {
                    return '请输入有效的模块名';
                }
                console.log(modules);
                if (modules[value.toString()]) {
                    return `${value}模块已存在`;
                }
                return true;
            },
        }]
        this.init();
    }
    /**
     * 用于初始化类
     */
    async init() {
        inquirer.prompt(this.questions).then(answers => {
            const {
                name
            } = answers;
            console.log(`开始创建模块${name}`);
            const port = modules.next;
            modules.next += 10;
            const module = {
                name,
                port
            };
            modules[name] = module;
            proxy[`/${name}`] = {
                target: `http://localhost:${port}`,
            };
            this.copy(resolve('template'), resolve('modules', name.toString()));
            fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
            fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
            fs.writeFileSync(resolve('modules', name.toString(), 'config.json'), JSON.stringify(module));
            console.log(`已创建模块${name}`);
            console.log(`正在安装模块${name}依赖`);
            child_process.spawn('cnpm', ['i'], {
                cwd: resolve('modules', name.toString()),
                shell: true,
            });
        })
    };
    /**
     * 拷贝文件
     * @param {*} from
     * @param {*} to
     */
    copy(from, to) {
        child_process.spawnSync('cp', ['-r', from, to]);
    };
}

new Generate();