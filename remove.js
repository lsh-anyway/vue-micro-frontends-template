const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const args = require('minimist')(process.argv.splice(2));
const modules = require('./config/modules');
const proxy = require('./config/proxy');
const app_modules = require('./APP/modules.json');

const remove = (target) => {
  child_process.spawnSync('rm', ['-r', target]);
};

const resolve = (...argvs) => path.join(__dirname, ...argvs);

const names = args._;

console.log(names);

if (names.length === 0) {
  console.log('请输入模块名')
} else {
  names.forEach(name => {
    name = name.toString();
    if (!modules[name]) {
      console.log(`模块${name}不存在`)
    } else {
      console.log(`开始删除模块${name}`);
      delete modules[name];
      delete proxy[`/${name}`];
      app_modules.splice(app_modules.indexOf(name), 1);
      remove(resolve('modules', name.toString()));
      fs.writeFileSync(resolve('APP', 'modules.json'), JSON.stringify(app_modules));
      fs.writeFileSync(resolve('config', 'modules.json'), JSON.stringify(modules));
      fs.writeFileSync(resolve('config', 'proxy.json'), JSON.stringify(proxy));
      console.log(`已删除模块${name}`);
    }
  });
}
