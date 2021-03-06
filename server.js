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
.get('/my-todo-list', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(__dirname  +"/public/todolist.html");
})
.get('/lists', function(req, res){
    returnList(res, req);
})
.post('/lists', function(req,res){
    updateMatchingItem(req);
    returnList(res, req);
})
.post('/lists/remove', function(req,res){
    removeMatchingItem(req);
    returnList(res, req);
})
.use(function(req, res, next){
    res.redirect("/my-todo-list")
});
app.listen(8080);

function returnList(res, req) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.write(JSON.stringify(req.session.todolist));
    res.end();
}

function removeMatchingItem(req) {
    var sessionList = req.session.todolist;
    var itemToRemove = req.body.text;
    var existingItem = sessionList.find(x => x.text === itemToRemove);
    if (typeof (existingItem) !== "undefined") {
        var indexToUpdate = sessionList.indexOf(existingItem);
        req.session.todolist.splice(indexToUpdate, 1);
    }
}

function updateMatchingItem(req) {
    var sessionList = req.session.todolist;
    var todoListItem = {
        id: req.body.id,
        text: req.body.text,
        status: req.body.status,
    };
    var existingItem = sessionList.find(x => x.text === todoListItem.text);
    if (typeof (existingItem) !== "undefined") {
        var indexToUpdate = sessionList.indexOf(existingItem);
        sessionList[indexToUpdate] = todoListItem;
    }
    else {
        sessionList.push(todoListItem);
    }
}

