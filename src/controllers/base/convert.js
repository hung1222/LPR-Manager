const debug = require('debug')('debug:convert');
const moment = require('moment');


let convertInputDate = (date, isToday=false, isNow=false) => {
    try {
        if(isToday)
            return moment().format("YYYY-MM-DD");
        if(isNow)
            return moment().format("YYYY-MM-DD HH:mm:ss");
        if(!date)
            return null;

        if( moment(date, "DD-MM-YYYY HH:mm:ss", true).isValid() )
            return moment(date, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        if( moment(date, "DD-MM-YYYY", true).isValid() )
            return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD HH:mm:ss");
        return null;
    } catch (e) {
        debug(`ERROR: convertInputDate || ${e}`);
        return e.message;
    }
};

let convertOutputDate = (date, isToday=false) => {
    try {
        if(isToday)
            return moment().format("DD-MM-YYYY");
        if(!date)
            return null;

        if( moment(date, "YYYY-MM-DD HH:mm:ss", true).isValid() )
            return moment(date, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
        if( moment(date, "YYYY-MM-DD", true).isValid() )
            return moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
        return null;
    } catch (e) {
        debug(`ERROR: convertOutDate || ${e}`);
        return e.message;
    }
};

module.exports = {
    convertInputDate,
    convertOutputDate,
};