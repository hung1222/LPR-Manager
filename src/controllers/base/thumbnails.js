/**
 * Module:    Xử lý hình ảnh
 * Author:    Tinasoft.vn
 * @version:  v3.0.0
 * Create:    9/2019      by @Harian
 * Modified:  dd/mm/yyyy  by @
 *
 */


const path = require('path');
const sharp = require('sharp');
const util = require('util');
const debug = require('debug')('debug:thumbnails');
const config = require('../../../config/config').media;
const format_extension = ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'raw'];

async function resizeImage(pathUrl, size){
    try {
        let width = size.size[0];
        let height = size.size[1];
        if( util.isNullOrUndefined(width) || util.isNullOrUndefined(height) )
            throw Error('Invalid image size');

        let format = path.extname(pathUrl).slice(1);
        let basename = path.basename(pathUrl,format);
        let pathUrlResize = path.format({
            dir: path.dirname(pathUrl),
            name: `${basename}${width}x${height}.`,
            ext: format
        });
        debug(width, height, pathUrlResize);
        debug(path.join(config.MEDIA_ROOT, pathUrl));
        if (!format_extension.includes(format))
            throw Error('Invalid image format');

        await sharp(path.join(config.MEDIA_ROOT, pathUrl))
        .resize(width, height)
        .toFormat(format)
        .toFile(path.join(config.MEDIA_ROOT, pathUrlResize));
        return pathUrlResize;
    } catch (err) {
        throw err;
    }
}

function getThumbnail(filePath, size) {
    // nếu chưa có thì tạo mới
}


function getThumbnailUrl(filePath, size) {

}

module.exports = {
    resizeImage,
    getThumbnail,
    getThumbnailUrl,
    format_extension,
}
