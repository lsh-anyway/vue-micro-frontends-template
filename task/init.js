const fs = require('fs');
const path = require('path');
const {
  spawn
} = require('child_process');


const resolve = (...argvs) => path.join(__dirname, ...argvs);

const modules = fs.readdirSync(resolve('../modules'));

const install = (name, target) => {
  const process = spawn('cnpm', ['i'], {
    cwd: target,
    shell: true,
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

console.log('开始安装依赖');
install('APP', resolve('../APP'));
modules.forEach(module => {
  install(module, resolve('../modules', module));
})