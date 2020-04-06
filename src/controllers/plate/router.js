const express = require('express');

const api = express();
const plateApi = require('./api');
// const passport = require('../base/passport');


api.get('/', plateApi.listViolationPlate);

api.get('/search', plateApi.searchViolationPlate);

api.get('/:plateId', plateApi.getViolationPlate);


module.exports = api;
