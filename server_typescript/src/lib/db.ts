var Sequelize = require("sequelize");
const logger = require('./logger');
var sequelize = new Sequelize('opex', 'root', 'root', {
    dialect: 'mysql',
    port: 3306
});

sequelize
    .authenticate()
    .then((success:any) => { 
        console.log("conntected  to databse");
    }, (err: any) => {
        console.log("error in conntecting  to databse",err);
    });

   

    sequelize
    .sync({force: false})
    .then((success:any) => { 
        console.log("syncing is done");
    }, (err:any) => {
        console.log("error databse syncing",err);
    });

    module.exports.executeNativeQuery = async (query: any,replacements: any)=>{
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
            throw new Error("Error in executing native query: "+query+error.message);
        }
        
    };
    let db:{sequelize:any,Sequelize: any}= {sequelize:'',Sequelize: ''};
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    export default db;