var db = require('../lib/db');

var Pending_messages = db.sequelize.define('MESSAGE', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    from: {
        type: db.Sequelize.STRING,
        allowNull: false,
    }
}, {
        freezeTableName: true,
        tableName: "pending_messages",
        paranoid: true,
    });



module.exports = Pending_messages;