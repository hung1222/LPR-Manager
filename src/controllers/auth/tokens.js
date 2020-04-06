const jwt = require('jsonwebtoken');
const debug = require('debug')('debug:token');
// const config = require('./../../../config/config');

/**
 * @description Generate a new signed token containing a specified user id
 * @param {object} user 
 * @param {string} secret 
 * @param {string} max_age
 * @return {string} token
 */
function get_token_for_user(user, secret, max_age=null) {
    try {
        if(max_age)
            return jwt.sign(user, secret, {expiresIn: max_age});
        return jwt.sign(user, secret);
    } catch (error) {
        debug(error);
    }
}

// function get_user_for_token() {
//     return;
// }

module.exports = {
    get_token_for_user,
    // get_user_for_token
};
