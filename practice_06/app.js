
//npm install express --save
var express = require('express')
var app = express()
app.get('/',function(req,res){
    res.send("<h1>Hello User</h1>")
})

app.use('/user/profile/', function(req,res,next){
    console.log("Request: "+new Date(), req.method, req.url)
})

/* app.use('/user/profile/:name', function(req,res,next){
    console.log("Request: "+req.params.name+" = "+new Date(), req.method, req.url)
}) */

app.listen(3000)