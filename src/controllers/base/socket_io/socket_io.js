'use strict';
/**
 * Module:    Quản lý kết socket.io
 * Author:    Tinasoft.vn
 * @version:  v2.0.0
 * Create:    09/2019     by @hocptit
 * Modified:  09/2019     by @hunglt
 * Modified:  mm/dd/yyyy  by @someone
 *
 */

const app = require('express')();
const ipAddress = require("ip").address();

const config = require('../../../../config/config');
let port = config.network.socket;

const http = require('http').createServer(app).listen(port);
const io = require('socket.io')(http);

setTimeout(() => {
    if (io)
        log.info(`Socket.io ready to use: ` + `${ipAddress}:${port}`);
    else
        log.error('Socket io has been error');
}, 100);

let socket = () => {
    return new Promise((resolve, reject) => {
        io.on('connection', function (sock) {
            if (sock) {
                log.info('New client connected. SocketID: ' + sock.id);
                return resolve(sock)
            }
        });
    })
};

global.io = io;

module.exports = {
    socket
};
