const Sequelize = require("sequelize");

const db = require('../../base/mysql/mysql');


const Owner = db.sequelize.define('owner', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.ENUM,
        values: ['M', 'F', 'O']
    },
    dateOfBirth: {
        type: Sequelize.DATEONLY
    },
    placeOfBirth: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING,
        defaultValue: 'media/avatar/default-avatar.png'
    },
    plateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    vehicleType: {
        type: Sequelize.STRING
    },
    createdDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});


module.exports = {
    Owner
};
