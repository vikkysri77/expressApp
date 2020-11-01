var fs = require('fs');
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const { exec } = require("child_process");

// create application/json parser
var jsonParser = bodyParser.json();

var executionId;
 
app.listen(3000, () => {
 console.log("Server running on port 3000");
});

app.get("/results/:id", (req, res, next) => {
	 if (fs.existsSync('/home/ubuntu/reports/'+req.params.id+'_Index.html')) {
	res.sendFile('/home/ubuntu/reports/'+req.params.id+'_Index.html');
	 } else {
	 res.status(404).json({error: "Still execution please wait for few mins" });
	 }
   });

app.get('/scripts', jsonParser, function(req, res){
  res.json(fs.readdirSync('../../AutomationDemo/Specs/', {withFileTypes: true})
  .filter(item => !item.isDirectory())
  .map(item => item.name));
});

  app.post('/protractor/scripts', jsonParser, function (req, res) {

    if(req.body.scriptName !== undefined && req.body.scriptName !== null && req.body.scriptName !== ""){
	try {
  		if (fs.existsSync('../../AutomationDemo/Specs/'+req.body.scriptName)) {
			executionId = req.body.fileID;
    			console.log("timestamp for exectution:"+executionId);
		        res.json({"testscriptName":req.body.scriptName,"fileID":req.body.fileID, status: "sucessfully executing in container"});

//			exec('sudo docker run --name devtest --mount type=bind,source="/home/ubuntu/reports",target=/home/ubuntu/AutomationDemo/reports client-protractor:latest', (error, stdout, stderr) => {

			exec("ls", (error, stdout, stderr) => {
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
			res.status(404).json({error: 'script does not exist! Please contact the automation tem'});
		}
		} catch(err) {
  			console.error(err)
		}	    
      } else  {
        res.status(404).json({ error: 'something is wrong' });
    };

 });
