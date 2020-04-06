/**
 * @version v2.0.6
 */

const debug = require('debug')('debug:attachments');
const asyncBusboy = require('async-busboy');
const response = require('../base/response');
const storage = require('../base/storage');

async function addAttachment(req, res){
    try {
        debug("addAttachment");
        // Save file
        let formData = await asyncBusboy(req);
        let fileData = await storage.getFileAsFieldname(formData.files, 'attached_file');
        if (!fileData)
            return response.badData(res, "Incomplete arguments 'attached_file'", "Wrong arguments.");
        if (!formData.fields.contentType)
            return response.badData(res, "Incomplete arguments 'contentType'", "Wrong arguments.");
        storage.saveFile(fileData, formData.fields.contentType.toLowerCase(), null, async (err, file) => {
            if (err)
                return response.badData(res, err);
            try {
                // Save to DB
                return response.created(res, file);
            }catch (error) {
                log.error(error);
                response.badData(res, error);
            }
        });
    }catch (error) {
        log.error(error);
        response.internal(res, error.message);
    }
}

module.exports = {
    addAttachment
};
