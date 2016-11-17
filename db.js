var Sequelize=require('sequelize');
var sequelize=new Sequelize(undefined,undefined,undefined,{
"dialect":"sqlite",
"storage":__dirname+"/data/todosdatabase.sqlite"
});

var db={};
db.todo=sequelize.import(__dirname+"/models/todos.js");
db.sequelize=sequelize;
db.Sequelize=Sequelize;

module.exports=db;