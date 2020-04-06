const express = require('express');

const route = express();
const statisticApi = require('./api');
// const passport = require('../base/passport');


route.get('/violation', statisticApi.violationStatistic);

route.get('/owner', statisticApi.ownerStatistic);

route.get('/sms', statisticApi.smsStatistic);

route.get('/violation_time', statisticApi.lastYearViolationStatistic);

route.get('/sms_time', statisticApi.yearSMSStatistic);


module.exports = route;
