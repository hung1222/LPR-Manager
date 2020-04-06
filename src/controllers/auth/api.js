/**
 * @version 2.0.2
 */

const express = require('express');

const api = express();
const authService = require('./service');
const passport = require('../base/passport');

// api.get('/', passport.customerAuth, (req, res) => {
//     res.send(req.customer);
// });

api.post('/register', authService.register);

api.post('/', authService.login);

api.get('/resendOtp', passport.customerAuthWithoutActive, authService.resendOTP);

api.post('/verify', passport.customerAuthWithoutActive, authService.activeAccount);

module.exports = api;
