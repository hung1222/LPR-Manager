const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const debug = require('debug')('debug:passport');

const response = require('./response');
const {jwtConfig} = require('../../../config/config');
const Staff = require('../admin/models/staff');


let opts_admin = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.staff.secret
};

const adminStrategy = new JwtStrategy(opts_admin, async (payload, done) => {
    try {
        let staff = await Staff.findOne({where: {uuid: payload.uuid}});
        if (!staff) return done(null, false);

        let pw = staff.password;
        let check = pw.slice(pw.length - jwtConfig.staff.csLength, pw.length) === payload.cs;
        if (!check) return done(null, false);

        staff.password = undefined;
        done(null, staff);
    } catch (error) {
        debug(error);
        return done(error, false);
    }
});

// Passport strategy
passport.use('admin-rule', adminStrategy);

/**
 * @description Authentication token in Header request of admin
 * @returns + Admin info
 *          - Response status code 401
 */
function adminAuthenticate(req, res, next) {
    return passport.authenticate("admin-rule", {session: false}, (err, user) => {
        if (err || !user)
            return response.forbidden(res, 'Unauthorized_account', 'tinasoft.exceptions.WrongArguments');
        req.user = user;
        next();
    })(req, res, next);
}

module.exports = {
    adminAuth: adminAuthenticate
};
