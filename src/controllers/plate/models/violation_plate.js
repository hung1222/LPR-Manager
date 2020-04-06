const Sequelize = require("sequelize");

const db = require('../../base/mysql/mysql');

const {Owner} = require('../../owner/models/owner');

const alertSts = {
    WAIT: '0',
    DONE: '1',
    ABANDONED: '2'
};

const ViolationPlate = db.sequelize.define('violation_plate', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ownerId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    plateNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    vehicleImg: {
        type: Sequelize.TEXT
    },
    plateImg: {
        type: Sequelize.TEXT
    },
    overview: {
        type: Sequelize.TEXT
    },
    cameraName: {
        type: Sequelize.STRING
    },
    alertStatus: {
        type: Sequelize.ENUM(),
        values: Object.values(alertSts),
        defaultValue: alertSts.WAIT
    },
    createdDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    indexes: [{
        fields: ['plateNumber', 'cameraName', 'alertStatus']
    }]
});

ViolationPlate.belongsTo(Owner);


module.exports = {
    ViolationPlate,
    alertSts
};
