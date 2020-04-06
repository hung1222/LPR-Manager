const moment = require('moment');
const {Op} = require('sequelize');

const {Owner} = require('../owner/models/owner');
const {ViolationPlate, alertSts} = require('./models/violation_plate');

const response = require('../base/response');


async function listViolationPlate(req, res) {
    try {
        let plates = await ViolationPlate.findAll();
        res.status(200).send(plates);
    } catch (err) {
        log.error(err);
        res.boom.badImplementation(err);
    }
}

async function getViolationPlate(req, res) {
    const {plateId} = req.params;
    try {
        let plate = await ViolationPlate.findByPk(plateId);
        response.ok(res, plate);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function searchViolationPlate(req, res) {
    let {startDate, endDate, param} = req.query;
    try {
        let obj = {};
        if (param)
            Object.assign(obj, {plateNumber: param});

        if (startDate && endDate) {
            endDate = moment(endDate).add(1, 'days').format('YYYY-MM-DD');
            Object.assign(obj, {
                createdDate: {[Op.between]: [startDate, endDate]}
            });
        }

        let plates = await ViolationPlate.findAll({
            where: obj,
            include: [Owner],
            // raw: true
        });
        response.ok(res, plates);
    } catch (err) {
        log.error(err);
        res.boom.internal(err);
    }
}


module.exports = {
    listViolationPlate,
    getViolationPlate,
    searchViolationPlate,
};