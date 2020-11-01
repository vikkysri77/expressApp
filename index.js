var fs = require('fs');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

// create application/json parser
var jsonParser = bodyParser.json()
 
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/results", (req, res, next) => {
	res.sendFile('/home/ubuntu/sample/target/screenshots/htmlReport.html');
 // res.json("Application is up");
   });

app.get('/scripts', jsonParser, function(req, res){
  res.json(fs.readdirSync('../../AutomationDemo/Specs/', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name));
});

  app.post('/protractor/scripts', jsonParser, function (req, res) {
    // var files = fs.readdirSync('/assets/photos/');

    if(req.body.scriptName !== undefined && req.body.scriptName !== null && req.body.scriptName !== ""){
        console.log(req.body.scriptName);
        fs.readdir('./', (err, files) => {
            files.forEach(file => {
              console.log(file);
            });
          });
        res.send("Hello");
    } else  {
        res.status(404).json({ error: 'something is wrong' });
    };

  });
