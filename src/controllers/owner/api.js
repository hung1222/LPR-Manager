
const {Owner} = require('./models/owner');
const {ViolationPlate} = require('../plate/models/violation_plate');

const response = require('../base/response');



async function listOwner(req, res) {
    try {
        let owners = await Owner.findAll();
        res.status(200).send(owners);
    } catch (err) {
        log.error(err);
        res.boom.badImplementation(err);
    }
}

async function getOwner(req, res) {
    const id = req.params.ownerId;
    try {
        let owners = await Owner.findByPk(id);
        response.ok(res, owners);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function createOwner(req, res) {
    const {fullName, gender, dateOfBirth, placeOfBirth, phoneNumber, plateNumber, vehicleType} = req.body;
    console.log(req.body);
    try {
        let owners = await Owner.create({
            fullName,
            gender,
            dateOfBirth,
            phoneNumber,
            placeOfBirth,
            plateNumber,
            vehicleType
        });
        response.created(res, owners);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}


async function editOwner(req, res) {
    const id = req.params.ownerId;
    const {
        fullName,
        gender,
        avatar,
        phoneNumber,
        dateOfBirth,
        placeOfBirth,
        plateNumber,
        vehicleType
    } = req.body;

    try {
        let obj = {};
        if (fullName) obj.fullName = fullName;
        if (gender) obj.gender = gender;
        if (phoneNumber) obj.phoneNumber = phoneNumber;
        if (avatar) obj.avatar = avatar;
        if (dateOfBirth) obj.dateOfBirth = dateOfBirth;
        if (placeOfBirth) obj.placeOfBirth = placeOfBirth;
        if (plateNumber) obj.plateNumber = plateNumber;
        if (vehicleType) obj.vehicleType = vehicleType;

        await Owner.update(obj, {where: {id: id}});
        let newInfo = await Owner.findByPk(id);
        response.ok(res, newInfo);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

async function deleteOwner(req, res) {
    const id = req.params.ownerId;
    try {
        let result = await Owner.destroy({where: {id: id}});
        if (result < 0)
            return response.badRequest(res, 'Failed to delete owner');
        response.noContent(res);
    } catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}


module.exports = {
    listOwner,
    getOwner,
    createOwner,
    editOwner,
    deleteOwner
};