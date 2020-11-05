var fs = require('fs');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const { exec } = require("child_process");

// create application/json parser
var jsonParser = bodyParser.json();

var executionId;
var scriptName;
 
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/results/:id", (req, res, next) => {
	 if (fs.existsSync('/home/ubuntu/reports/'+req.params.id+'.html')) {
	res.sendFile('/home/ubuntu/reports/'+req.params.id+'.html');
	 } else {
	 res.status(404).json({error: "Still executing please wait for few mins" });
	 }
   });

app.get('/scripts', jsonParser, function(req, res){
  res.json(fs.readdirSync('../../sample/specs/', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name));
});

  app.post('/protractor/scripts', jsonParser, function (req, res) {

    if(req.body.scriptName !== undefined && req.body.scriptName !== null && req.body.scriptName !== ""){
	try {
  		if (fs.existsSync('../../sample/specs/'+req.body.scriptName)) {
			executionId = req.body.fileID;
			scriptName = req.body.scriptName;
    			console.log("timestamp for exectution:"+executionId);
		        res.json({"testscriptName":scriptName,"fileID":executionId, status: "sucessfully executing in container"});

			console.log('docker run --name '+executionId+' --env SCRIPT="protractor conf.js --specs="./specs/'+scriptName+'" --params.reportName='+executionId+'" --mount type=bind,source="/home/ubuntu/reports",target=/home/ubuntu/sample/reports client-protractor:latest');
	exec('docker run --name '+executionId+' --env SCRIPT="protractor conf.js --specs="./specs/'+scriptName+'" --params.reportName='+executionId+'" --mount type=bind,source="/home/ubuntu/reports",target=/home/ubuntu/sample/reports client-protractor:latest', (error, stdout, stderr) => {

	//	exec("ls", (error, stdout, stderr) => {
				    if (error) {
					            console.log(`error: ${error.message}`);
					            return;
					        }
				    if (stderr) {
					            console.log(`stderr: ${stderr}`);
					            return;
					        }
				    console.log(`stdout: ${stdout}`);
			});

  		} else {
			res.status(404).json({error: 'script does not exist! Please contact the automation team'});
		}
		} catch(err) {
  			console.error(err);
		}	    
      } else  {
        res.status(404).json({ error: 'something is wrong' });
    };

 });
