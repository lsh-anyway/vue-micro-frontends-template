const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const args = require('minimist')(process.argv.splice(2));
const modules = require('./config/modules');
const proxy = require('./config/proxy');
const app_modules = require('./APP/modules.json');

const copy = (from, to) => {
    child_process.spawnSync('cp', ['-r', from, to]);
};

const resolve = (...argvs) => path.join(__dirname, ...argvs);

const names = args._;

console.log(names);

if (names.length === 0) {
    console.log('请输入模块名')
} else {
    names.forEach(name => {
        name = name.toString();
        if (modules[name]) {
            console.log(`模块${name}已存在`)
        } else {
            console.log(`开始创建模块${name}`);
            const port = modules.next;
            modules.next += 10;
            const module = {
                name,
                port
            };
            app_modules.push(name);
            modules[name] = module;
            proxy[`/${name}`] = {
                target: `http://localhost:${port}`,
            };
            copy(resolve('template'), resolve('modules', name.toString()));
            fs.writeFileSync(resolve('APP', 'modules.json'), JSON.stringify(app_modules));
            fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
            fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
            fs.writeFileSync(resolve('modules', name.toString(), 'config.json'), JSON.stringify(module));
            console.log(`已创建模块${name}`);
            console.log(`正在安装模块${name}依赖`);
            child_process.spawn('cnpm', ['i'], {
                cwd: resolve('modules', name.toString()),
            });
        }
    });
}
