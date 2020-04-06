const {Owner} = require('../owner/models/owner');
const {ViolationPlate, alertSts} = require('./models/violation_plate');
const imageBase = require('../base/save_image');
const {thisYearViolationStatistic} = require('../statistic/api');


io.on('connection', socket => {
    socket.on('plate', async (data) => {
        await violationPlate(socket, data);
        await thisYearViolationStatistic();
    });
});

async function violationPlate(socket, data) {
    try {
        let obj = {
            ownerId: null,
            plateNumber: data.plate,
            vehicleImg: imageBase.saveBase64Image(data.vehicleImg),
            plateImg: imageBase.saveBase64Image(data.plateImg),
            overview: imageBase.saveBase64Image(data.overview),
            cameraName: 'Camera_1',
            alertStatus: alertSts.WAIT
        };

        const owner = await Owner.findOne({where: {plateNumber: data.plate}});
        if (!owner)
            obj.alertStatus = alertSts.ABANDONED;

        if (owner && owner.id)
            obj.ownerId = owner.id;

        log.info(`Saved plate number: ${data.plate} into database`);
        let violation = await ViolationPlate.create(obj);
        let info = await ViolationPlate.findByPk(violation.id);
        io.sockets.emit('violation_plate', info);
    } catch (error) {
        log.error(error);
    }
}

async function checkAlert() {
    try {
        let docs = await ViolationPlate.findAll({
            where: {alertStatus: alertSts.WAIT},
            attributes: ['id', 'ownerId', 'plateNumber', 'createdDate'],
            include: [{
                model: Owner,
                attributes: ['id', 'fullName', 'phoneNumber']
            }]
        });
        if (docs.length <= 0)
            return null;

        log.info(`Detected ${docs.length} violation vehicle!`);
        for (let item of docs) {
            if (!item.plateNumber || !item.owner.phoneNumber)
                continue;

            let result = await ViolationPlate.update({alertStatus: alertSts.DONE}, {
                where: {id: item.id}
            });

            if (result < 0) continue;

            let msg = `Warning: Plate number ${item.plateNumber} traffic violation at ${item.createdDate}`;
            io.sockets.emit('alert_vehicle', {
                phoneNumber: item.owner.phoneNumber,
                msg: msg
            });
            log.info(`Warned ${item.owner.fullName} traffic violation`);
        }
    } catch (error) {
        log.error(error);
    }
}

function greenBulb() {
    // log.info('green bulb');
    io.sockets.emit('traffic_light', 'green');
    setTimeout(() => {
        yellowBulb();
    }, 1000 * 8);
}

function yellowBulb() {
    // log.info('yellow bulb');
    io.sockets.emit('traffic_light', 'yellow');
    setTimeout(() => {
        redBulb();
    }, 1000 * 2);
}

function redBulb() {
    // log.info('red bulb');
    io.sockets.emit('traffic_light', 'red');
    setTimeout(() => {
        greenBulb();
    }, 1000 * 10);
}

module.exports = {
    checkAlert: checkAlert,
    greenBulb
};

