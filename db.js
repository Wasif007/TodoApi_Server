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
db.user=sequelize.import(__dirname+"/models/user.js");
db.token=sequelize.import(__dirname+"/models/token.js");
db.sequelize=sequelize;
db.Sequelize=Sequelize;
db.user.hasMany(db.todo);
db.todo.belongsTo(db.user);
module.exports=db;