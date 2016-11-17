var Sequelize=require('sequelize');
var sequelize=new Sequelize(undefined,undefined,undefined,{
"dialect":"sqlite",
"storage":__dirname+"/playground2sqlite.sqlite"
});
var todo=sequelize.define("todos",{
description:{
type:Sequelize.STRING,
allowNull:false,
validate:{
	len:[5,25]
}
},
completed:{
type:Sequelize.BOOLEAN,
allowNull:false,
defaultValue:false
}
});

sequelize.sync({force:true}).then(function(){
console.log("Everything Synched");
todo.create({
	description:"Walk the dog",
	completed:false
}).then(function(){
return todo.create({
	description:"Walk the cat"
})
}).then(function(){
	return todo.findAll({
		where:{
			description:{
				$like:'%d%'
			}
		}
	});
}).then(function(todos)
{
	todos.forEach(function(todo)
	{
console.log(todo.toJSON());

	});
});
});