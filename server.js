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
app.listen(PORT,function(){
	console.log("Listening on port"+PORT);
});