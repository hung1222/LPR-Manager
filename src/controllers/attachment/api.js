/**
 * @version v2.0.1
 */

const express = require('express');
const api = express();

const attachmentService = require('./service');
const passport = require('../base/passport');
const roleService = require('../role/service');

api.post('/', passport.adminAuth, attachmentService.addAttachment);
api.post('/customer', passport.customerAuth, attachmentService.addAttachment);

module.exports = api;