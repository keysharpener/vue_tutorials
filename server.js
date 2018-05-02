var express = require("express")
var session = require('cookie-session');

var app = express();
var userLists = {};
app
.use(session({secret:'topsecretstuff'}))
.use(express.static(__dirname + '/public'))
.use(function(req,res,next){
    if (typeof(req.session.todolist) === 'undefined'){
        req.session.todolist = [];
    }
    next();
})
.get('/', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname  +"/public/todolist.html");
})
.get('/lists', function(req, res){
    res.setHeader('Content-Type', 'text/json');
    res.write(JSON.stringify(req.session.todolist))
    res.end()
})
.post('/lists', function(req,res){
    var todoListItem = {
        name: req.query.name,
        text: req.query.text,
        status: req.query.status,
    }
    req.session.todolist.push(todoListItem)
})
.use(function(req, res, next){
    res.redirect("/")
});
app.listen(8080);
