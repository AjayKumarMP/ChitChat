var db = require('../lib/db');
const Pending_messages = require('./pending_messages');
var User = db.sequelize.define('USER', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    }
}, {
        freezeTableName: true,
        tableName: "chat_users",
        paranoid: true,
    });

User.hasMany(Pending_messages, {as : 'pending_messages'});

module.exports = User;