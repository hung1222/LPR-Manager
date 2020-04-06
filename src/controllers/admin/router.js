/**
 * @version 2.0.3
 */

const express = require('express');

const api = express();
const adminApi = require('./api');
// const passport = require('../base/passport');


api.get('/', (req, res) => {
    res.send('ok');
});

api.post('/register', adminApi.register);



module.exports = api;