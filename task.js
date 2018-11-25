const args = require('minimist')(process.argv.slice(2));
const { task } = args;

require(`./task/${task}.js`);
