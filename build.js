const path = require('path');
const fs = require('fs');
const {
  spawn
} = require('child_process');

const args = require('minimist')(process.argv.splice(2));
const modules = require('./config/modules');

const build = (name, target) => {
  const process = spawn('yarn', ['build'], {
    cwd: target
  });
  process.stdout.on('data', (data) => {
    console.log(`${name}-stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.log(`${name}-stderr: ${data}`);
  });

  process.on('${name}-close', (code) => {
    console.log(`子进程退出码：${code}`);
  });
};

const resolve = (...argvs) => path.join(__dirname, ...argvs);

const names = args._;

console.log(names);

if (names.length === 0) {
  console.log(`正在打包主模块`);
  build('APP', resolve('APP'))
} else {
  names.forEach(name => {
    name = name.toString();
    if (!modules[name]) {
      console.log(`模块${name}不存在`)
    } else {
      console.log(`正在打包模块${name}`);
      build(name, resolve('modules', name));
    }
  })
}
