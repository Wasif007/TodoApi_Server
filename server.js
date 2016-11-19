//For Server
var express=require('express');
//For making routes
var app=express();
//For middleware json request
var bodyparser=require('body-parser');
//For selecting port for local or heroku
var PORT=process.env.PORT || 3000;
//Underscore 
var _=require('underscore');
//Getting all db data
var db=require('./db.js');
var todos=[];
var todos_id=1;

//MiddleWare which when recieve json request parse it and than can be accessed from req.body
app.use(bodyparser.json());

//Root page
app.get("/",function(req,res) {
res.send("Hello root page");
});

//GET /about
app.get('/about',function(req,res)
{
	res.send("About Page");
})

//Get /todos
app.get("/todos",function(req,res){
	var query_paramss=req.query;
	var newArray=todos;
	var where={};
	if(query_paramss.hasOwnProperty('completed') && query_paramss.completed==="true")
	{
		where.completed=true;
	}else if(query_paramss.hasOwnProperty('completed') && query_paramss.completed==='false')
	{
		where.completed=false;
	}

	if(query_paramss.hasOwnProperty('q') && query_paramss.q.trim().length>0)
	{
		where.description={
			$like:"%"+query_paramss.q+"%"
		}
	}
	db.todo.findAll({where:where}).then(function(todos){
		res.json(todos);
	},function(e){
		res.status(401).send();
	});
/*	if(query_paramss.hasOwnProperty('completed') && query_paramss.completed==='true')
	{
		newArray=_.where(newArray,{completed:true});
	}
else if(query_paramss.hasOwnProperty('completed') && query_paramss.completed==='false')
	{
		newArray=_.where(newArray,{completed:false});
	}

	if(query_paramss.hasOwnProperty('q') && query_paramss.q.length > 0)
	{
		newArray=_.filter(newArray,function(todo)
		{
return todo.description.toLowerCase().indexOf(query_paramss.q) > -1;
		});
	}
	res.json(newArray);
*/
});

//Get /todos/:id
app.get("/todos/:id",function(req,res)
{
	var todos_id=parseInt(req.params.id);
	
	db.todo.findById(todos_id).then(function(todo)
	{
if(!!todo)
{
	return res.send(todo.toJSON());
}
else{
return res.status(404).send();
}
	},function(e)
	{
res.status(500).send();
	});
	/*var todo_found=_.findWhere(todos,{id:todos_id});
	

	if(todo_found)
	{
		res.json(todo_found);
	}
	else
	{
		res.status(400).send();
	}
	*/

});

//Post /todos
app.post("/todos",function(req,res){
var body=_.pick(req.body,'completed','description');

db.todo.create(body).then(function(todo)
{
res.send(todo.toJSON());
},function(e)
{
res.status(500).send();
});
/*if(!_.isBoolean(body.completed || !_.isString(body.description) || body.description.trim().length===0))
{res.status(400).send()}
body.description=body.description.trim();
body.id=todos_id;
todos.push(body);
todos_id=todos_id+1;
res.json(body);
*/});

//Delete /todos/:id
app.delete("/todos/:id",function(req,res)
{
var todos_id=parseInt(req.params.id);
db.todo.destroy({
	where:{
		id:todos_id
	}
}).then(function(rows){
	if(rows===0)
	{
		res.status(401).send();
	}
	else{
		res.status(204).send();
	}
},function(e){
	res.status(500).send();
});
/*var matched=_.findWhere(todos,{id:todos_id});
if(!matched)
{
	return res.status(400).send();
}
else{
	todos=_.without(todos,matched);
res.json(matched);
}
*/
});

//Put /todos/:id
app.put("/todos/:id",function(req,res){
	var todos_id=parseInt(req.params.id);
	var matched=_.findWhere(todos,{id:todos_id});
	var attributes={};
	var body=_.pick(req.body,"completed","description");

if(body.hasOwnProperty('description') )
{
attributes.description=body.description;
}	
if(body.hasOwnProperty('completed'))
{
	attributes.completed=body.completed;
}

db.todo.findById(todos_id).then(function(todo){
if(todo)
{
todo.update(attributes).then(function(todo){
	return res.send(todo.toJSON());
},function(e){
	return res.status(400).send();
});
}
else{
	res.status(404).send();
}
},function(e){
	res.status(500).send();
});
	/*
d
if(!matched)
{
	return res.status(400).send();
}
var body=_.pick(req.body,"completed","description");
var newtodo={};
if(body.hasOwnProperty('description') && body.description.trim().length >0 && _.isString(body.description))
{
newtodo.description=body.description;
}
else if(body.hasOwnProperty('description'))
{
	return res.status(400).send();
}

if(body.hasOwnProperty('completed') && _.isBoolean(body.completed))
{
	newtodo.completed=body.completed;
}
else if(body.hasOwnProperty('completed'))
{
	return res.status(400).send();
}
_.extend(matched,newtodo);
res.json(matched);
*/
});

//Post /users
app.post("/users",function(req,res){
	var body=_.pick(req.body,'email','password');
	db.user.create(body).then(function(user){
		res.send(user.toPublicJson());
	},function(e){
		res.status(400).json(e);
	});
});

//Post /user/login
app.post("/user/login",function(req,res)
{
var body=_.pick(req.body,"email","password");
db.user.findOne({
	where:
	{
	email:body.email}
}).then(function(user){
	if(!user)
	{
		res.status(404).send();
	}
	res.send(user.toPublicJson());
},function(e){
	res.status(500).send();
})
});
db.sequelize.sync({force:true}).then(function()
{
app.listen(PORT,function(){
	console.log("Listening on port"+PORT);
});
});
