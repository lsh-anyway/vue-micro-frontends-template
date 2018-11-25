const net = require('net');
/**
 * 检测端口是否被占用，返回一个promise对象
 * @param {端口} port
 */
const probe = (port) => {
    return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(port, '0.0.0.0');

    server.on('listening', function () {
        if (server) {
            server.close()
        }
        resolve(true)
    })

    server.on('error', function (err) {
        let result = true
        if (err.code === 'EADDRINUSE') {
            result = false
        }
        resolve(result)
    })
    })
}

module.exports = probe;
