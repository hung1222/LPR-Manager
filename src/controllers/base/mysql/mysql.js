const debug = require('debug')('debug:mysql');
const Sequelize = require("sequelize");

const {mysql} = require('../../../../config/config');
const convert = require('../convert');
require("log");

let host = process.env.mysql_localhost || mysql.host;
let port = process.env.mysql_port || mysql.port;
let user = process.env.mysql_user || mysql.user;
let password = process.env.mysql_password === "" ? process.env.mysql_password : process.env.mysql_password || mysql.password;
let database = process.env.mysql_database || mysql.database;
let connectionLimit = mysql.connectionLimit;

const sequelize = new Sequelize(database, user, password, {
    host: host,
    port: mysql.port,
    logging: false,
    dialect: 'mysql',
    timezone: '+07:00',
    pool: {
        max: connectionLimit,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    define: {
        freezeTableName: true,
        timestamps: false,
        underscored: false
    },
    dialectOptions: {
        typeCast: function (field, next) {
            if (field.type === 'DATETIME' || field.type === 'DATE')
                return convert.convertOutputDate(field.string());
            return next();
        }
    }
});

function authenticate() {
    let connection = setInterval(() => {
        authenticate();
    }, 1000 * 60);
    sequelize.authenticate()
        .then(function (conn) {
            clearInterval(connection);
            log.info(`Database connected: ` + `${host}:${port}`.yellow);
        })
        .catch(e => log.error(`ERROR: NOT CONNECTED TO DATABASE | ${e}`));
    sequelize.sync()
        .then((res) => {
            log.info(`Đã đồng bộ model.`);
        })
        .catch(err => {
            debug('ERROR: Chưa đồng bộ model: ');
            debug(err);
        });
}

authenticate();

module.exports = {sequelize};
