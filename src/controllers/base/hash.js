/**
 * Module:    Tạo chuỗi hash bằng sha256
 * Author:    Tinasoft.vn
 * @version:  v3.0.0
 * Create:    9/2019      by @Harian
 * Modified:  dd/mm/yyyy  by @
 *
 */

const crypto = require('crypto');

function getRandomValue(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    return current_date + random;
}
/**
 * Get the hash by sha256 for string.
 * @param string
 * @return: hash code.
 */
function getHash(string){
    return crypto.createHash('sha256').update(string).digest('hex');
}

function getEmailHash(email){
    return getHash(email.toLowerCase());
}

function getUserHash(user){
    if (user && user.email)
        return getEmailHash(user.email);
    else
        return getHash(getRandomValue());
}

function getProjectIDHash(projectID){
    return getHash(projectID);
}

function getProjectHash(project){
    if (project && project.projectID)
        return getProjectIDHash(project.projectID);
    else
        return getHash(getRandomValue());
}

function getAttachmentHash(attachment){
    if (attachment)
        return getHash(attachment);
    else
        return getHash(getRandomValue());
}


module.exports = {
    getUserHash,
    getProjectIDHash,
    getProjectHash,
    getAttachmentHash
}

