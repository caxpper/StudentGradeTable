
const express = require('express');
const mysql = require('mysql');
const credentials = require('./mysqlCredentials.js');
const bodyParser = require("body-parser");

const con = mysql.createConnection(credentials); 

const endPoint = express();

endPoint.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
endPoint.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
endPoint.use(bodyParser.json());

endPoint.get('/sgt/get',function(req,res){
    var output = {
        success: false,
        errors:[],
        data:[]
    }
    con.connect(function(err) {        
        console.log("Connected!");
        con.query('SELECT * FROM students',function(err,result,fields){
            if(!err){                
                output.success = true;
                output.data = result;                
            }else{
                console.log("Error: ", err);
                output.errors = err;
            }
            let jsonObj = JSON.stringify(output);         
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(jsonObj);   
            res.end();         
        });
    });
});

endPoint.post('/sgt/create',function(req,res){
    var output = {
        success: false,
        errors:[],
        data:[]
    }
    let {name, course, grade} = req.body;
    con.connect(function(err) {           
        var query = con.query(`INSERT INTO students (name, course, grade) VALUES ('${name}','${course}',${grade})`, function(err, result) {
            if(!err){                
                output.success = true;
                output.data = result;                
            }else{
                console.log("Error: ", err);
                output.errors = err;
            }
            let jsonObj = JSON.stringify(output);
            console.log('json object: ', jsonObj);         
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(jsonObj);   
            res.end();         
        });
    });
});

endPoint.post('/sgt/delete',function(req,res){
    var output = {
        success: false,
        errors:[],
        data:[]
    }
    let {student_id} = req.body;
    con.connect(function(err) {        
        console.log("Connected!");        
        var query = con.query(`DELETE FROM students WHERE id = ${student_id}`, function(err, result) {
            if(!err){                
                output.success = true;
                output.data = result;                
            }else{
                console.log("Error: ", err);
                output.errors = err;
            }
            let jsonObj = JSON.stringify(output);
            console.log('json object: ', jsonObj);         
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(jsonObj);   
            res.end();         
        });
    });
});

endPoint.listen(3000,function(){
    console.log('Server listening...');
});