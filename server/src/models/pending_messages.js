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
        type: db.Sequelize.BIGINT,
        allowNull: false,
    }
}, {
        freezeTableName: true,
        tableName: "pending_messages",
    });



module.exports = Pending_messages;