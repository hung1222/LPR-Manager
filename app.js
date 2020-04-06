const debug = require('debug')('debug:app');
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const boom = require('express-boom');

require('./src/controllers/base/mysql/mysql');
require('./src/controllers/base/socket_io/socket_io');

app.use('/media', express.static('media'));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(boom());
app.use(cors());
app.options('*', cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require('./src/routes');
app.use('/api/v1', routes);

app.use((err, req, res, next) => {
    if (err) {
        log.error('Invalid Request data!');
        debug(err);
        res.statusCode = 400;
        res.send('Invalid Request data')
    } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
});

require('./src/controllers/plate/socket');
require('./src/controllers/plate/socket').greenBulb();
require('./src/utils/schedule');

module.exports = app;
