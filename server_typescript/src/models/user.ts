import db from '../lib/db';
import Pending_messages from './pending_messages';

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
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
}, {
        freezeTableName: true,
        tableName: "chat_users",
        paranoid: true,
    });

User.hasMany(Pending_messages, {as : 'pending_messages'});

export default User;