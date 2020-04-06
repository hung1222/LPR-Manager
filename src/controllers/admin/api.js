const debug = require('debug')('debug:admin');
const {Op} = require("sequelize");

const Staff = require('./models/staff');

const {jwtConfig} = require('./../../../config/config');
const getToken = require('../auth/tokens').get_token_for_user;
const response = require('../base/response');
const validators = require('../base/validators');


async function login(req, res) {
    const {username, password} = req.body;
    try {
        if (!username || !password)
            return response.badRequest(res, 'Username and password are required');

        let staff = await Staff.findOne({
            where: {username}
        });
        if (!staff || !staff.comparePassword(password))
            return response.badRequest(res, 'Wrong username or password');

        let cs = staff.password.slice(staff.password.length - jwtConfig.staff.csLength, staff.password.length);
        const authToken = getToken({uuid: staff.uuid, cs: cs}, jwtConfig.staff.secret, jwtConfig.staff.life);
        staff.password = undefined;
        let staffInfo = Object.assign({authToken}, staff.toJSON());

        response.ok(res, staffInfo);
    } catch (error) {
        debug(error);
        response.badRequest(res, error, 'tinasoft.exceptions.WrongArguments');
    }
}

// Register
async function register(req, res) {
    const {username, password, fullName} = req.body;
    try {
        let validateStaff = await Staff.count({where: {username}});
        if (validateStaff > 0)
            return response.badRequest(res, 'User is already in use');

        if (!username || !password)
            return response.badRequest(res, 'Invalid data');

        if (!validators.validate_password(password))
            return response.badRequest(res, 'Invalid password');

        const newStaff = await Staff.create({
            username: username,
            password: password,
            fullName: fullName || 'New staff'
        });

        newStaff.password = undefined;
        response.created(res, newStaff);
    } catch (error) {
        debug(error);
        response.badRequest(res, error);
    }
}

// async function searchStaff(req, res) {
//     const {fullName, username, idCardNumber, phoneNumber, role, storeId, isActive} = req.query;
//     try {
//         if (Object.keys(req.query).length === 0)
//             return await getAllStaff(req, res);
//
//         let params = {};
//         Object.assign(params, {role: {[Op.ne]: Role.Admin}});
//         if (fullName) Object.assign(params, {fullName});
//         if (username) Object.assign(params, {username});
//         if (idCardNumber) Object.assign(params, {idCardNumber});
//         if (phoneNumber) Object.assign(params, {phoneNumber});
//         if (role) Object.assign(params, {role});
//         if (storeId) Object.assign(params, {storeId});
//         if (isActive === 'true' || isActive === 'false')
//             Object.assign(params, {isActive: isActive === 'true'});
//
//         let result = await Staff.findAll({
//             where: params,
//             attributes: {exclude: ['password']},
//             include: [Store]
//         });
//         response.ok(res, result);
//     } catch (error) {
//         debug(error);
//         response.internal(res, error, 'tinasoft.exceptions.WrongArguments');
//     }
// }

async function changePassword(req, res) {
    const {currentPassword, password} = req.body;
    try {
        const staff = await Staff.findByPk(req.user.id);
        if (staff.comparePassword(currentPassword) !== true)
            return response.badRequest(res, 'Password doesn\'t match');

        if (!validators.validate_password(password))
            return response.badRequest(res, 'Invalid password');

        const result = await Staff.update(
            {password: password},
            {
                individualHooks: true,
                where: {id: req.user.id}
            }
        );

        if (result < 1)
            return response.badRequest(res, 'Action failed');
        response.noContent(res);
    } catch (error) {
        debug(error);
        response.internal(res, error, 'tinasoft.exceptions.WrongArguments');
    }
}

module.exports = {
    login,
    register,
    changePassword
};
