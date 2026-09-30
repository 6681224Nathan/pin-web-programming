var express = require('express');
var fs = require('fs');
var crypto = require('crypto');

var routing = express()

var users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf8'));

routing.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

routing.get('/profile/:id', function(req, res) {

    var user = users.find(function(u) {
        return u.id === req.params.id;
    });

    if (!user) {
        res.status(404).send('<h1>User ' + req.params.id + ' not found</h1>');
        return;
    }

    var hashed = crypto.createHash('sha1').update(user.password).digest('hex');

    res.send(
        'id: ' + user.id + '<br>' +
        'username: ' + user.username + '<br>' +
        'password: ' + hashed + '<br>' +
        'fullname: ' + user.fullname
    );
});

routing.listen(8081)
