var express = require("express")
var session = require('cookie-session');
var bodyParser = require('body-parser');


var app = express();
app
.use(session({secret:'topsecretstuff'}))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))
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
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(req.session.todolist))
    res.end()
})
.post('/lists', function(req,res){
    var sessionList = req.session.todolist;
    var todoListItem = {
        id: req.body.id,
        text: req.body.text,
        status: req.body.status,
    }
    var existingItem = sessionList.find(x=>x.text === todoListItem.text)
    if (typeof(existingItem) !== "undefined"){
        var indexToUpdate = sessionList.indexOf(existingItem);
        sessionList[indexToUpdate] = todoListItem;
    }
    else{
        sessionList.push(todoListItem)
    }
    res.end();
})
.post('/lists/remove', function(req,res){
    var sessionList = req.session.todolist;    
    var itemToRemove = req.body.text
    var existingItem = sessionList.find(x=>x.text === itemToRemove)
    if (typeof(existingItem) !== "undefined"){
        var indexToUpdate = sessionList.indexOf(existingItem);
        req.session.todolist.splice(indexToUpdate, 1);
    }
    res.end();
})
.use(function(req, res, next){
    res.redirect("/")
});
app.listen(8080);
