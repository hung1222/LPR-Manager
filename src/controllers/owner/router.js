const express = require('express');

const api = express();
const ownerApi = require('./api');
// const passport = require('../base/passport');


api.get('/', ownerApi.listOwner);

api.get('/:ownerId', ownerApi.getOwner);

api.post('/', ownerApi.createOwner);

api.patch('/:ownerId', ownerApi.editOwner);

api.delete('/:ownerId', ownerApi.deleteOwner);


module.exports = api;
