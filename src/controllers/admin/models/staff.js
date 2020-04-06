const bcrypt = require('bcrypt');
const Sequelize = require("sequelize");

const db = require('../../base/mysql/mysql');

const saltRounds = 10;

const Staff = db.sequelize.define('staff', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'New staff'
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    avatar: Sequelize.TEXT,
    createdDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});


function generateHash(admin) {
    if (!admin.changed('password'))
        return null;

    let salt = bcrypt.genSaltSync(saltRounds);
    admin.password = bcrypt.hashSync(admin.password, salt);
    return admin.password;
}

Staff.beforeCreate(generateHash);
Staff.beforeUpdate(generateHash);

Staff.prototype.comparePassword = function (plaintextPassword) {
    return bcrypt.compareSync(plaintextPassword, this.password);
};

Staff.sync().then(() => {
    Staff.count({where: {username: 'admin'}}).then(count => {
        if (count) return;
        Staff.create({username: 'admin', password: '123456'});
    })
});

module.exports = Staff;
