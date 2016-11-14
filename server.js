var express=require('express');
var app=express();
var PORT=process.env.PORT || 3000;

var todos=[{
	id:1,description:"Walking the dog",completed:false
},
{
id:2,description:"Jogging",completed:true
}];

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

app.listen(PORT,function(){
	console.log("Listening on port"+PORT);
});