/**
 * Module:    Lưu trữ tập tin cho thư mục Media
 * Author:    Tinasoft.vn
 * @version:  v3.0.0
 * Create:    9/2019      by @Harian
 * Modified:  dd/mm/yyyy  by @
 *
 */

const debug = require('debug')('debug:storage');
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const asyncBusboy = require('async-busboy');

const config = require('../../../config/config').media;
const hash = require('./hash');

/**
 * @example typeDir = 'user'
 * @example pathDir = '0919b293b45ef726c193de798e4afb83'
 * @example filename = 'img_1.png'
 * @returns 'user\0\9\1\9\b293b45ef726c193de798e4afb83\img_1.png'
 */
function modifyPath(typeDir, pathDir, filename) {
    pathDir = hash.getAttachmentHash();
    return path.join(typeDir, pathDir[0], pathDir[1], pathDir[2], pathDir[3], pathDir.slice(4), filename);
}

/**
 * @param file
 * @param pathUrl return from modifyPath
 * @param done
 */
async function saveFileToPath(file, pathUrl, done){
    try{
        await fs.mkdirSync(path.join(config.MEDIA_ROOT, path.dirname(pathUrl)), {recursive: true});
        let fstream = fs.createWriteStream(path.join(config.MEDIA_ROOT, pathUrl));
        file.pipe(fstream);
        fstream.on('close', function () {
            debug("Saved!");
            return done();
        });
        fstream.on('error', function (err) {
            return done(err);
        });
    } catch (err) {
        log.error(err);
        return done(err);
    }
}

/**
 *
 * @param file: fileData stream
 * @param typeDir:  case 'face':
 *                  case 'fingerprint':
 *                  case 'document':
 * @param pathDir:  random hashCode
 * @returns     + done(null, file)
 *              - done(err)
 * @example     storage.saveFile(fileData, req.contentType.toLowerCase(), null, async (err, file) => {} )
 */
function saveFile(file, typeDir, pathDir, done) {
    try {
        //pre check
        switch (typeDir) {
            case 'ticket':
            case 'user':
            case 'avatar':
            case 'wallet':
                break;
            default:
                throw Error("Bad path: " + typeDir);
        }

        //save file
        let filename = file.filename;

        // if Cương
        let extName = path.extname(filename).split(".")[1] || "";

        if( !config.FORMAT_EXTENSIONS.includes(extName.toLowerCase()) )
            throw new Error("Extension not allow");
        filename += '.jpg';

        debug("Saving:  " + filename);
        let pathUrl = modifyPath(typeDir, pathDir, filename);
        debug("To Path: " + pathUrl);
        file.pathUrl = pathUrl;
        file.pathLink = path.posix.normalize( path.join(config.MEDIA_URL, pathUrl) );

        saveFileToPath(file, pathUrl, (err)=>{
            if (err)
                return done(err);
            return done(null, file);
        });
    } catch (err) {
        log.error(err);
        return done(err);
    }
}

async function emptyFolderInPath(fullPathDir, excluded){
    try {
        if (!fs.existsSync(fullPathDir))
            throw Error("Folder is not exist.");
        let files = fs.readdirSync(fullPathDir);
        if (!files){
            debug('No file');
            return true;
        }
        for (let file of files) {
            debug(file);
            if (!excluded.includes(file))
                await fs.unlinkSync(path.join(fullPathDir, file));
        }
        debug('Folder emptied!');
        return true;
    } catch (err) {
        throw err;
    }
}

async function emptyFolder(typeDir, pathDir, excluded) {
    try {
        debug('Folder emptying ...');
        pathDir = await modifyPath(typeDir, pathDir, '.');
        debug(pathDir);
        let fullPathDir = path.join(config.MEDIA_ROOT, pathDir);
        await emptyFolderInPath(fullPathDir, excluded);
        debug('Empty done!');
    } catch(err){
        log.error(err.message);
        throw err;
    }
}

function getFilesizeInPath(fullPathUrl) {
    let stats = fs.statSync(fullPathUrl);
    let fileSizeInBytes = stats["size"];
    return fileSizeInBytes;
}

function getFilesizeInBytes(pathUrl) {
    return getFilesizeInPath( path.join(config.MEDIA_ROOT, pathUrl) );
}


async function getFileAsFieldname(files, fieldname){
    for (let file of files){
        if (file.fieldname === fieldname)
            return file;
    }
    return null;
}


module.exports = {
    saveFile,
    getFileAsFieldname,
}
