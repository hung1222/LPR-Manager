const path = require('path');
const network = require('./config_network');

module.exports = {
    HTTP_MAX_HEADER_SIZE: '1mb',
    FORMAT_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'raw', ""],

    // The absolute url is mandatory because attachments
    // urls depends on it. On production should be set
    // something like https://media.tiansoft.vn/media/
    MEDIA_URL: `${network.hostname}:${network.port}/media/`,
    STATIC_URL: `${network.hostname}:${network.port}/static/`,

    // Static configuration.
    MEDIA_ROOT: path.resolve('media'),
    STATIC_ROOT: path.resolve('static'),
    STORAGE_ROOT: path.resolve('storage'),
    ADMIN_ROOT: path.resolve('src/controllers/admin/config'),
};
