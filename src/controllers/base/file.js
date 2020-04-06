/**
 * Module:    Convert ASCII
 * Author:    Tinasoft.vn
 * @version:  v2.0.1
 * Create:    9/2019        by @hocptit
 * Modified:  09/03/2019
 *
 */


const fs = require('fs-promise');
const path = require('path');
let logFF = require('path').basename(__filename);
const logColor = msg => require('./logColor')(msg, logFF);
const log = require('../base/logMonitoring').log;
const debug = require('debug')('debug:file');

/**
 * @description convert ASCII string to binary
 * @param {String} str
 * @returns {string|void}
 */
function encode(str) {
    function zeroPad(num) {
        return "00000000".slice(String(num).length) + num;
    }

    return str.replace(/[\s\S]/g, function (str) {
        str = zeroPad(str.charCodeAt().toString(2));
        return str
    });
}

/**
 * @description convert ASCII to binary to string
 * @param str
 * @returns {string}
 */
function decode(str) {
    str = str.match(/.{1,8}/g).join(" ");
    return str.split(" ").map(function (elem) {
        return String.fromCharCode(parseInt(elem, 2));
    }).join("");
}

/**
 *@description read file
 * @param {String} filename
 * @param {Function} done ( err, data) ={}err: boolean, data is object
 */

function readFile(filename, done) {
    let path = require('path').resolve('storage', 'adminsetting', `${filename}.dat`);
    fs.readFile(path)
        .then(result => {
            // let data = decode(result.toString());
            return done(true, JSON.parse(result.toString()))
        })
        .catch(e => {
            logColor(`color:red readFile ${e}`);
            return done(false)
        })
}

/**
 * @param {String} filename
 * @param {Object} obj
 * @param {Function} done (err, data) =>{} err : boolean
 */
function writeFile(filename, obj, done) {
    let path = require('path').resolve('storage', 'adminsetting', `${filename}.dat`);
    let string = JSON.stringify(obj);
    // let dataWrite = encode(string);
    fs.writeFile(path, string, 'utf8')
            .then(res => {
                return done(true)
            })
            .catch(e => {
                logColor(`color:red writeFile | ` + e);
                return done(false)
            })
}

let convertFileLogMonitoring = (fileName) => {
    try {
        let pathRead = require('path').resolve('storage', 'logs_monitoring', `${fileName}.dat`);
        let pathWrite = require('path').resolve('storage', 'logs_monitoring', `${fileName}.txt`);
        fs.readFile(pathRead)
            .then(result => {
                let data = decode(result.toString());
                let arrayData = data.split("||");
                for(let i = 0; i < arrayData.length; i++){
                    let dataWrite = arrayData[i] + `\r\n`;
                    fs.appendFile(pathWrite, dataWrite, 'utf8')
                        .then(res => {
                            debug(`Create file log!!!`)
                        })
                        .catch(e => {
                            debug('Not create file log');
                            debug(e)
                        })
                }
            })
    } catch (e) {
        debug(e)
    }
};


module.exports = {
    readFile,
    writeFile,
    encode,
    convertFileLogMonitoring
};