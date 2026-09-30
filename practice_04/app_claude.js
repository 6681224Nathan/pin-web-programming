var express = require('express');
var fs = require('fs');         // to read users.json
var crypto = require('crypto'); // to hash the password (same as Ex07)

var routing = express()

// Read users.json ONCE, when the server starts, and turn the text into a JavaScript array.
// Every visit to /profile/:id reuses this same array instead of re-reading the file.
// (Because of that, if you edit users.json you must restart the server to see the change.)
var users = JSON.parse(fs.readFileSync(__dirname + '/users.json', 'utf8'));

// Home page: send the index.html file
routing.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Ex19 practice: http://localhost:8081/profile/0
routing.get('/profile/:id', function(req, res) {
    // 1. Find the user whose id matches the one in the URL.
    //    Both are text ('1' in users.json, '1' from the URL), so they compare directly.
    var user = users.find(function(u) {
        return u.id === req.params.id;
    });

    // 2. No user with that id? Send a 404 and stop here
    if (!user) {
        res.status(404).send('<h1>User ' + req.params.id + ' not found</h1>');
        return;
    }

    // 3. Hash the password with SHA-1 so the real one is never shown
    var hashed = crypto.createHash('sha1').update(user.password).digest('hex');

    // 4. Send the user's details back as a web page
    res.send(
        'id: ' + user.id + '<br>' +
        'username: ' + user.username + '<br>' +
        'password: ' + hashed + '<br>' +
        'fullname: ' + user.fullname
    );
});

routing.listen(8081)
