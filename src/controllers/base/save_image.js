const fs = require('fs');

function saveBase64Image(base64Image) {
    try {
        let now = Date.now();
        let rdNumber = Math.floor(Math.random()*100000);
        const base_url = './';
        const url = 'media/plate/' + now + rdNumber + '.jpg';
        // const base64Data = base64Image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        const buf = Buffer.from(base64Image);
        let b64 = buf.toString('utf8');
        fs.writeFileSync(base_url + url, b64, {encoding: 'base64'});
        return url;
    } catch (e) {
        console.log(e);
        return null;
    }
}


module.exports = {
    saveBase64Image
};