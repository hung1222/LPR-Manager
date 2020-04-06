const schedule = require('node-schedule');

const plate = require('../controllers/plate/socket');

schedule.scheduleJob('*/5 * * * * *', async () => {
    // console.log('The answer to life, the universe, and everything!');
    await plate.checkAlert();
});
