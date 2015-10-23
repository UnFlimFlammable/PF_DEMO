var express = require('express');
var fs = require('fs');
var path = require('path');

var User = require('./js/User.js');
var Account = require('./js/Account.js');
var Transaction = require('./js/Transaction.js');

var app = express();
app.use(express.static('static'));


//Login WS, returns a Stringified JSON Representation of User
app.get('/login', function(req, res){
  var email = req.query.email;
  var password = req.query.password;

  var fileName = "data/users/" + email.replace(/@/g, "_");
  fs.readFile(fileName, function(err, data){
    if(err){
      console.log(err);
      res.send("Error: User Not Found");
      return;
    }

    var UserJson = data.toString();
    var User = JSON.parse(UserJson);

    if(User.password.toString() != password.toString()){
      res.send("Error: Incorrect Credentials");
      return;
    }

    res.send(UserJson);
  });
});

app.get("/htmlFragment", function(req, res){
  var file = req.query.file;
  fs.readFile("static/"+file, function(err, data){
    if(err){
      res.send("Error");
      console.log(err);
      return;
    }

    var html = data.toString();
    res.send(html);
    return;
  });
});

app.get('/persistNewUser', function(req, res){
  var user = req.query.user;
  var email = req.query.email;
  var password = req.query.password;
  var newUser = new User(user, password, email);
  console.log(email);
  var fileName = "data/users/" + email.replace(/@/g, "_");
  fs.open(fileName, "wx", function(err, fd){
    if(err){
      console.log(err);
      res.send("Error: User Already Exists");
      return;
    }else{
      fs.write(fd, JSON.stringify(newUser), function(err, written, string){
          if(err){
            console.log(err);
            res.send(err);
            return;
          }
      });
      console.log(JSON.stringify(newUser));
      res.send("Success");
    }
  });
});

//Start the server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
