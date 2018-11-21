const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const args = require('minimist')(process.argv.splice(2));
const modules = require('./config/modules');
const proxy = require('./config/proxy');
const app_modules = require('./APP/modules.json');

const rename = (oldPath, newPath) => {
  fs.renameSync(oldPath, newPath);
};

const resolve = (...argvs) => path.join(__dirname, ...argvs);

const names = args._;

console.log(names);

if (names.length === 2) {
  const oldName = names[0].toString();
  const newName = names[1].toString();
  if (!modules[oldName]) {
    console.log(`不存在模块${oldName}`);
  } else if (modules[newName]) {
    console.log(`模块${newName}已存在，请选择其他命名`)
  } else {
    console.log('开始重命名');
    const oldPath = resolve('modules', oldName);
    const newPath = resolve('modules', newName);
    modules[`${newName}`] = modules[`${oldName}`];
    modules[`${newName}`].name = newName;
    delete modules[oldName];
    proxy[`/${newName}`] = proxy[`/${oldName}`];
    delete proxy[`/${oldName}`];
    app_modules.splice(app_modules.indexOf(oldName), 1);
    app_modules.push(newName);
    fs.writeFileSync(resolve('APP', 'modules.json'), JSON.stringify(app_modules));
    fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
    fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
    fs.writeFileSync(resolve('modules', oldName.toString(), 'config.json'), JSON.stringify(modules[`${newName}`]));
    rename(oldPath, newPath);
    console.log('重命名完成');
  }
} else {
  console.log('参数错误');
}
