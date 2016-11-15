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
	if(query_paramss.hasOwnProperty('completed') && query_paramss.completed==='true')
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

});

//Get /todos/:id
app.get("/todos/:id",function(req,res)
{
	var todos_id=parseInt(req.params.id);
	var todo_found=_.findWhere(todos,{id:todos_id});
	

	if(todo_found)
	{
		res.json(todo_found);
	}
	else
	{
		res.status(400).send();
	}

});

//Post /todos
app.post("/todos",function(req,res){
var body=_.pick(req.body,'completed','description');
if(!_.isBoolean(body.completed || !_.isString(body.description) || body.description.trim().length===0))
{res.status(400).send()}
body.description=body.description.trim();
body.id=todos_id;
todos.push(body);
todos_id=todos_id+1;
res.json(body);
});

//Delete /todos/:id
app.delete("/todos/:id",function(req,res)
{
var todos_id=parseInt(req.params.id);
var matched=_.findWhere(todos,{id:todos_id});
if(!matched)
{
	return res.status(400).send();
}
else{
	todos=_.without(todos,matched);
res.json(matched);
}
});

//Put /todos/:id
app.put("/todos/:id",function(req,res){
	var todos_id=parseInt(req.params.id);
	var matched=_.findWhere(todos,{id:todos_id});
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
});
app.listen(PORT,function(){
	console.log("Listening on port"+PORT);
});