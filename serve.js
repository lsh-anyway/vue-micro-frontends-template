const path = require('path');
const fs = require('fs');
const {
  spawn
} = require('child_process');

const args = require('minimist')(process.argv.splice(2));
const modules = require('./config/modules');

const serve = (name, target) => {
  const process = spawn('yarn', ['serve'], {
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
  console.log(`正在启动主模块`);
  serve('APP', resolve('APP'))
} else if  (names.length === 1) {
  const name = names[0].toString();
  if (!modules[name]) {
    console.log(`模块${name}不存在`)
  } else {
    console.log(`正在启动模块${name}`);
    serve(name, resolve('modules', name));
  }
} else {
  console.log('为了方便管理，一次只能启动一个模块');
}
