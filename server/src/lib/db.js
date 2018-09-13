var Sequelize = require("sequelize");
const logger = require('./logger');
var sequelize = new Sequelize('opex', 'root', 'root', {
    dialect: 'mysql',
    port: 3306
});

sequelize
    .authenticate()
    .then((success) => { 
        console.log("conntected  to databse");
    }, (err) => {
        console.log("error in conntecting  to databse",err);
    });

   

    sequelize
    .sync({force:false})
    .then((success) => { 
        console.log("syncing is done");
    }, (err) => {
        console.log("error databse syncing",err);
    });

    module.exports.executeNativeQuery = async (query,replacements)=>{
        var data = '';
        try {
            if(!replacements){
            data = await sequelize.query(query, { type: Sequelize.QueryTypes.SELECT });
            }else{
                data = await sequelize.query(query,{replacements:replacements, type: Sequelize.QueryTypes.SELECT});
            }
            return data;
        } catch (error) {
            logger.error("Error in executing native query: ",query,error.message)
            throw new Error("Error in executing native query: ",query,error.message);
        }
        
    };

    module.exports.sequelize = sequelize;
    module.exports.Sequelize = Sequelize;