/**
 * Module:    Quản lý cấu hình
 * Author:    Tinasoft.vn
 * @version:  v3.0.1
 * Create:    5/2019
 * Modified:  9/2019
 *            dd/mm/yyyy    by @someone
 *
 */

const network = require("./config_network");
const jwtConfig = require('./config_jwt');
const media = require('./config_media');
const mysql = require('./config_mysql');

module.exports = {
    network,
    jwtConfig,
    media,
    mysql
};
