var db = require('../lib/db');
var User = db.sequelize.define('USER',{
    id:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: db.Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: db.Sequelize.STRING,
        allowNull:false,
        validate:{
            isEmail: true,
        }
    },
    socketId: {
        type: db.Sequelize.STRING,
        allowNull:false,
    },
    active: {
        type: db.Sequelize.BOOLEAN,
        allowNull:false,
    }
},{
    freezeTableName: true,
    tableName: "chat_users",
    paranoid: true,
});



module.exports = User;