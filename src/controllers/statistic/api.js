const moment = require('moment');
const {Op} = require('sequelize');

const response = require('../base/response');

const {Owner} = require('../owner/models/owner');
const {ViolationPlate, alertSts} = require('../plate/models/violation_plate');


async function violationStatistic(req, res) {
    try {
        let thisMonth = [moment().set('date', 1).format('YYYY-MM-DD'), moment().set('date', 30).format('YYYY-MM-DD')];
        let lastMonth = [
            moment().subtract(1, 'months').set('date', 1).format('YYYY-MM-DD'),
            moment().subtract(1, 'months').set('date', 30).format('YYYY-MM-DD')
        ];

        let allViolation = await ViolationPlate.count();
        let thisMonthViolation = await ViolationPlate.count({
            where: {
                createdDate: {[Op.between]: thisMonth}
            }
        });
        let lastMonthViolation = await ViolationPlate.count({
            where: {
                createdDate: {[Op.between]: lastMonth}
            }
        });
        let result = {
            total: allViolation,
            thisMonth: thisMonthViolation,
            lastMonth: lastMonthViolation
        };
        response.ok(res, result);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function ownerStatistic(req, res) {
    try {
        let thisMonth = [moment().set('date', 1).format('YYYY-MM-DD'), moment().set('date', 30).format('YYYY-MM-DD')];
        let lastMonth = [
            moment().subtract(1, 'months').set('date', 1).format('YYYY-MM-DD'),
            moment().subtract(1, 'months').set('date', 30).format('YYYY-MM-DD')
        ];

        let allOwner = await Owner.count();
        let thisMonthOwner = await Owner.count({
            where: {
                createdDate: {[Op.between]: thisMonth}
            }
        });
        let lastMonthOwner = await Owner.count({
            where: {
                createdDate: {[Op.between]: lastMonth}
            }
        });
        let result = {
            total: allOwner,
            thisMonth: thisMonthOwner,
            lastMonth: lastMonthOwner
        };
        response.ok(res, result);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function smsStatistic(req, res) {
    try {
        let thisMonth = [moment().set('date', 1).format('YYYY-MM-DD'), moment().set('date', 30).format('YYYY-MM-DD')];
        let lastMonth = [
            moment().subtract(1, 'months').set('date', 1).format('YYYY-MM-DD'),
            moment().subtract(1, 'months').set('date', 30).format('YYYY-MM-DD')
        ];

        let allSMS = await ViolationPlate.count({where: {alertStatus: alertSts.DONE}});
        let thisMonthSMS = await ViolationPlate.count({
            where: {
                alertStatus: alertSts.DONE,
                createdDate: {[Op.between]: thisMonth}
            }
        });
        let lastMonthSMS = await ViolationPlate.count({
            where: {
                alertStatus: alertSts.DONE,
                createdDate: {[Op.between]: lastMonth}
            }
        });
        let result = {
            total: allSMS,
            thisMonth: thisMonthSMS,
            lastMonth: lastMonthSMS
        };
        response.ok(res, result);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function lastYearViolationStatistic(req, res) {
    try {
        let result = [];
        for (let i = 0; i < 12; i++) {
            let allViolation = await ViolationPlate.count({
                where: {createdDate: {[Op.between]: getPeriod(i, new Date().getFullYear() - 1)}}
            });
            result.push(allViolation);
        }
        console.log(result);
        response.ok(res, {lastYearVio: result});
    } catch (e) {
        log.error(e);
    }
}

async function thisYearViolationStatistic() {
    try {
        let result = [];
        for (let i = 0; i < 12; i++) {
            let allViolation = await ViolationPlate.count({
                where: {createdDate: {[Op.between]: getPeriod(i)}}
            });
            result.push(allViolation);
        }
        io.sockets.emit('monthly_statistic', result);
    } catch (e) {
        log.error(e);
    }
}

async function yearSMSStatistic(req, res) {
    try {
        let result = {
            done: [],
            aband: []
        };
        for (let i = 0; i < 12; i++) {
            let doneSMS = await ViolationPlate.count({
                where: {
                    alertStatus: alertSts.DONE,
                    createdDate: {[Op.between]: getPeriod(i)}
                }
            });
            result.done.push(doneSMS);

            let abandonedSMS = await ViolationPlate.count({
                where: {
                    alertStatus: alertSts.ABANDONED,
                    createdDate: {[Op.between]: getPeriod(i)}
                }
            });
            result.aband.push(abandonedSMS);
        }
        response.ok(res, result);
    } catch (e) {
        log.error(e);
    }
}

function getPeriod(month, year = 2020) {
    return [moment().set('year', year).set('month', month).set('date', 1).format('YYYY-MM-DD'),
        moment().set('year', year).set('month', month).set('date', 30).format('YYYY-MM-DD')];
}


module.exports = {
    violationStatistic,
    ownerStatistic,
    smsStatistic,
    thisYearViolationStatistic: thisYearViolationStatistic,
    lastYearViolationStatistic,
    yearSMSStatistic
};