// const debug = require('debug')('debug:auth');
// const fetch = require('node-fetch');
//
// const Customer = require('../customer/models/customer');
// const { Wallet } = require('../wallet/models/wallet');
// const { OrderCustomer } = require('../order/models/order_customer');
//
// const validators = require('../base/validators');
// const getToken = require('./tokens').get_token_for_user;
// const { jwtConfig, captcha } = require('./../../../config/config');
// const totp = require('../base/otp');
// const eSMS = require('../base/esms');
// const response = require('../base/response');
// const convert = require('../base/convert');
// const { readAdminConfig } = require('../admin/service');
//
//
// // Register
// async function register(req, res) {
//     const { phoneNumber, password, captchaValue, acceptedTerms } = req.body; // *Require
//     const { fullName, email, idCardNumber, gender, cityId, districtId, wardId } = req.body; // *Option
//     try {
//         if (!acceptedTerms)
//             return response.badRequest(res, 'You need agree to the Terms');
//
//         let validateCustomer = await Customer.count({ where: { phoneNumber } });
//         if (validateCustomer > 0)
//             return response.badRequest(res, 'Account is already in use');
//
//         // Check input
//         if (!phoneNumber || !password || !fullName)
//             return response.badRequest(res, 'Invalid data');
//
//         if (!validators.validate_phone(phoneNumber))
//             return response.badRequest(res, 'Invalid phone number');
//
//         if (!validators.validate_password(password))
//             return response.badRequest(res, 'Invalid password');
//
//         if (fullName && validators.isSpecialChar(fullName, validators.checkType.FULL_NAME))
//             return response.badRequest(res, 'Name shouldn\'t contain special characters');
//
//         if (email && !validators.validate_email(email))
//             return response.badRequest(res, 'Invalid email');
//
//         if (gender && !['M', 'F', 'O'].includes(gender))
//             return response.badRequest(res, 'Invalid gender');
//
//         // Check captcha
//         // const reqUrl = `${captcha.URL}?secret=${captcha.SECRET}&response=${captchaValue}`;
//         // let checkCaptcha = await fetch(reqUrl, { method: 'GET', options: { timeout: 2000 } })
//         //     .then(ret => ret.json())
//         //     .then(json => json);
//         //
//         // if (process.env.NODE_ENV === "DEV")
//         //     checkCaptcha = { success: true };
//         //
//         // debug(checkCaptcha);
//         // if (!checkCaptcha || checkCaptcha.success !== true)
//         //     return response.badRequest(res, 'Invalid captcha code');
//
//         // Create new wallet + order shopping cart
//         const newWallet = await Wallet.create();
//         const orderShoppingCart = await OrderCustomer.create();
//
//         let dataObj = {};
//         dataObj.phoneNumber = phoneNumber;
//         dataObj.password = password;
//         dataObj.walletId = newWallet.id;
//         dataObj.orderShoppingCartId = orderShoppingCart.id;
//         dataObj.fullName = fullName;
//
//         if (email) dataObj.email = email;
//         if (idCardNumber) dataObj.idCardNumber = idCardNumber;
//         if (gender) dataObj.gender = gender;
//         if (cityId) dataObj.cityId = cityId;
//         if (districtId) dataObj.districtId = districtId;
//         if (wardId) dataObj.wardId = wardId;
//
//         const newCustomer = await Customer.create(dataObj);
//         newCustomer.password = undefined;
//         orderShoppingCart.update({
//             customerId: newCustomer.id
//         });
//
//         if (process.env.NODE_ENV !== "DEV") {
//             let SMSResult = await eSMS.sendSmsOTP(phoneNumber);
//             debug('Send sms status ' + SMSResult);
//         }
//         debug(totp.generateOTP(phoneNumber));
//         response.created(res, newCustomer);
//     } catch (error) {
//         log.error(error);
//         response.badRequest(res, error, 'tinasoft.exceptions.WrongArguments');
//     }
// }
//
//
// // auth Login
// async function login(req, res) {
//     const { phoneNumber, password } = req.body;
//     try {
//         debug('debug ne:');
//         if (!phoneNumber || !password)
//             return response.badRequest(res, 'Invalid data');
//
//         let customer = await Customer.findOne({
//             where: { phoneNumber },
//             attributes: { exclude: ['id'] },
//             include: [Wallet, OrderCustomer]
//         });
//
//         if (!customer || !customer.comparePassword(password))
//             return response.badRequest(res, 'Wrong phone number or password');
//
//         if (customer.order_customer.ticketArray)
//             customer.order_customer.ticketArray = convert.stringObjToArray(customer.order_customer.ticketArray);
//
//         let pw = customer.password;
//         const cs = pw.slice(pw.length - jwtConfig.customer.csLength, pw.length);
//
//         const authToken = getToken(
//             { uuid: customer.uuid, cs: cs },
//             jwtConfig.customer.secret, jwtConfig.customer.life
//         );
//         customer.password = undefined;
//
//         const customerInfo = Object.assign({ authToken }, customer.toJSON());
//         response.ok(res, customerInfo);
//     } catch (error) {
//         log.error(error);
//         response.internal(res, error);
//     }
// }
//
//
// async function activeAccount(req, res) {
//     const { otp } = req.body;
//     try {
//         if (req.user.isActive === true)
//             return response.badRequest(res, error, 'Ur account is already activated!');
//
//         const phoneNumber = req.user.phoneNumber;
//         const check = totp.OTPVerification(otp, phoneNumber);
//         if (!check)
//             return response.badRequest(res, 'Invalid otp code');
//
//         let result = await Customer.update({ isActive: true }, { where: { phoneNumber } });
//         if (result < 1)
//             return response.badRequest(res, 'Action failed');
//
//         let customer = await Customer.findOne({
//             where: { phoneNumber },
//             attributes: { exclude: ['password'] }
//         });
//         response.ok(res, customer);
//     } catch (error) {
//         log.error(error);
//         response.internal(res, error);
//     }
// }
//
// async function resendOTP(req, res) {
//     try {
//         if (req.user.smsCharge && req.user.smsCharge >= readAdminConfig('MAX_SMS_PER_DAY'))
//             return response.badRequest(res, 'Out of sms charge');
//
//         let SMSResult = await eSMS.sendSmsOTP(req.user.phoneNumber);
//         if (!SMSResult)
//             return response.badRequest(res, 'Failed to send sms');
//
//         debug(totp.generateOTP(req.user.phoneNumber));
//         await Customer.update({ smsCharge: req.user.smsCharge + 1 }, { where: { id: req.user.id } });
//         response.ok(res, { status: true });
//     } catch (error) {
//         log.error(error);
//         response.badRequest(res, error, 'tinasoft.exceptions.WrongArguments');
//     }
// }
//
// module.exports = {
//     login,
//     register,
//     resendOTP,
//     activeAccount
// };
//
