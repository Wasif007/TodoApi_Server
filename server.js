//For Server
var express=require('express');
//For making routes
var app=express();
//For middleware json request
var bodyparser=require('body-parser');
//For selecting port for local or heroku
var PORT=process.env.PORT || 3000;

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
	res.json(todos);

});

//Get /todos/:id
app.get("/todos/:id",function(req,res)
{
	var todos_id=parseInt(req.params.id);
	var todo_found;
	todos.forEach(function(todo)
		{
			if(todo.id===todos_id)
			{
				todo_found=todo;
			}
		});
	if(todo_found)
	{
		res.json(todo_found);
	}
	else
	{
		res.status(400).send();
	}

});

//Post 
app.post("/todos",function(req,res){
var body=req.body;
body.id=todos_id;
todos.push(body);
todos_id=todos_id+1;
res.json(body);
});

app.listen(PORT,function(){
	console.log("Listening on port"+PORT);
});