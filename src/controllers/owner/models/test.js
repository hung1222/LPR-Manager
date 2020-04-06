const Sequelize = require("sequelize");

const db = require('../../base/mysql/mysql');


const test = db.sequelize.define('test', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    f1: {
        type: Sequelize.INTEGER,
        // unique: 'compositeIndex'
    },
    f2: {
        type: Sequelize.INTEGER,
        // unique: 'compositeIndex'
    }
}, {
    indexes: [
        { fields: ['f1', 'f2'], unique: true }
    ]
});


module.exports = {
    test
};
