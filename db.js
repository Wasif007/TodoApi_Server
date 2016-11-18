var Sequelize=require('sequelize');
var env_variable=process.env.NODE_ENV || "development";
var sequelize;
if(env_variable==="production")
{
sequelize=new Sequelize(process.env.DATABASE_URL,{
dialect:"postgres"
});
}
else{
sequelize=new Sequelize(undefined,undefined,undefined,{
"dialect":"sqlite",
"storage":__dirname+"/data/todosdatabase.sqlite"
});	
}


var db={};
db.todo=sequelize.import(__dirname+"/models/todos.js");
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;