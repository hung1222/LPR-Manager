const express = require('express');
const router = express();


const admin = require('./controllers/admin/router');
router.use('/admin', admin);

const owner = require('./controllers/owner/router');
router.use('/owner', owner);

const plate = require('./controllers/plate/router');
router.use('/plate', plate);

const statistic = require('./controllers/statistic/router');
router.use('/statistic', statistic);




module.exports = router;
