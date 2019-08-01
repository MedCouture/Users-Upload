require("dotenv").config();
var express = require('express');
var bodyParser = require('body-parser');
var upload = require('express-fileupload')
var csv = require('csv-parser');
var fs = require('fs');
var passport = require('passport-local');
var mysql = require('mysql');
const sql = require('mssql');



module.exports = (app) => {

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'testdb'
    })

    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        server: process.env.DB_HOST,
        database: 'Web'
    }

    app.use(upload())

    //admin route
    app.get('/', (req, res) => {

        res.render('upload')
    });

    //Post route to upload csv
    app.post('/users', (req, res) => {
        //if file wasn't uploaded from the client then send a 400 error
        // console.log(req.files);
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }
        let fileHeaders = false;
        //storing file in a variable
        let sampleFile = req.files.sampleFile;
        //storing file name in a variable
        let fileName = sampleFile.name
        //invoke mv method to place file in the directory.
        sampleFile.mv(`./upload/${fileName}`, (err) => {
            if (err)
                return res.status(500).send(err)
            // res.send('File Uploaded')
            //empty array to store person data object
            let dataArray = [];
            //person data object
            let personData = { person: dataArray };
            //Invoking fs readstream to read csv
            fs.createReadStream(`./upload/${fileName}`)
                .pipe(csv())
                .on('data', (data) => {
                    //trimmed trailing spaces and \n\r\t removed
                    for (let i in data) {
                        if (i === 'id' || i === 'FullName' || i === 'FirstName' || i === 'LastName' || i === 'DepartmentDesc' || i === 'JobCode' || i === 'JobCodeDescription' || i === 'FTE' || i === 'Gender' || i === 'Email') {

                            fileHeaders = true;

                        } else {

                            fileHeaders = false;
                            console.log('Please fix data headers')
                        }
                    }
                    if (fileHeaders === true) {
                        dataArray.push(data)
                    }
                })
                .on('end', () => {


                    sql.connect(config, err=>{
                        if (err) throw err;

                        new sql.Request().query('select * from dbo.zzUserSite_NYHSS1temp', (err,results)=>{
                            console.log(results);
                            let newArray = dataArray;
                            let updateArray = [];
    
                            let renderData = {
                                upperson: updateArray,
                                newperson: newArray
                            }
                            search(results.recordset, dataArray, updateArray);
                            // newUsers(newArray);
                            res.render('index', renderData)
                        })
                    })

                    //get the data from database and store in variable
                    // connection.query('SELECT * FROM zzusersite_nyhss1temp', (err, results) => {
                    //     if (err) throw err;
                    //     //check to see if the uploaded data record exists against dbData
                    //     //if true: then push it in toUpdate Array
                    //     //else: push it in to newUser Array
                    //     let newArray = dataArray;
                    //     let updateArray = [];

                    //     let renderData = {
                    //         upperson: updateArray,
                    //         newperson: newArray
                    //     }
                    //     search(results, dataArray, updateArray);
                    //     // newUsers(newArray);
                    //     res.render('index', renderData)
                    // })
                })
        })
    });

    app.put('/users/:email', (req, res) => {
        let email = req.params.email;
        let fte = req.body.fte;
        console.log(email)
        console.log(fte)
        connection.query(`UPDATE zzusersite_nyhss1temp SET fte = ? WHERE email =?`, [fte, email], function (err, results, fields) {
            if (err) throw err;
            console.log(results);
        })
    })

    app.post('/users/add', (req, res) => {
        let data = req.body;
        console.log(data);
        connection.query('INSERT INTO zzusersite_nyhss1temp SET ?', data, function (err, results) {
            if (err) throw err;
            console.log(results);
            return res.status(200);
        })
    })

    //post upload function definition
    let search = function (dbArray, csvArray, newUpdateArray) {
        //loop through dbdata array and get its email to see if it matches with csv
        for (let i = 0; i < dbArray.length; i++) {
            //while looping through dbdata array loop through csv data and see if value matches
            for (let j = 0; j < csvArray.length; j++) {
                if (csvArray[j].Email.trim() === dbArray[i].Email.trim()) {
                    newUpdateArray.push(csvArray[j])
                    // console.log(newUpdateArray);
                    if (csvArray.length > 0) {
                        csvArray.splice(j, 1);
                    } else if (csv.Array.length === 0) {
                        csvArray.pop();
                    }

                    // console.log(`This is csv\n`,csvArray);
                }
            }

        }
    }


}