const debug = require('debug')('debug:validator');
// const lodash = require('lodash');


function validate_password(password) {
    // let strongPW = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    let mediumPW = new RegExp("^(?=.{6,})");

    return mediumPW.test(password);
}


// console.log(isSpecialChar('aaa\'', checkType.FULL_NAME));

module.exports = {
    validate_password
};