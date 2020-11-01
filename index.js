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

app.get("/results/:id", (req, res, next) => {
	console.log(req.params.id);
	res.sendFile('/home/ubuntu/AutomationDemo/reports/'+req.params.id+'_Index.html');

   });

app.get('/scripts', jsonParser, function(req, res){
  res.json(fs.readdirSync('../../AutomationDemo/Specs/', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name));
});

  app.post('/protractor/scripts', jsonParser, function (req, res) {

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
