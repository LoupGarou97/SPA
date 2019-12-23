'use strict'

const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});

const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "usersdb",
  password: "12345"
});

app.set("views engine", "hbs");

app.get("/", function(req, res){
  pool.query("SELECT * FROM user", function(err, data){
    if (err) {
      return console.log(err);
    } else {
      res.render("index.hbs", {
        user: data
      });
    }
  });
});

app.get("/view/:ID", function(req, res) {
  const id = req.params.ID;
  pool.query("SELECT * FROM user WHERE ID=?", [id], function(err, data) {
    if(err) {
      return console.log(err);
    } else {
     res.render("view.hbs", {
        user: data
      });
    }
  });
});

app.get("/create", function(req, res) {
  res.render("create.hbs");
});

app.post("/create", urlencodedParser, function (req, res) {
  
  if(!req.body) return res.sendStatus(400);
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const midleName = req.body.MidleName;
  const age = req.body.Age;
  const email = req.body.Email;
  const phone = req.body.Phone;
  pool.query("INSERT INTO user(FirstName, LastName, MidleName, Age, Email, Phone) VALUES (?,?,?,?,?,?)",
  [firstName, lastName, midleName, age, email, phone], function(err, data) {
    if (err) return console.log(err);
    res.redirect("/");
  });
});

app.get("/edit/:ID", function(req, res){
  const id = req.params.ID;
  pool.query("SELECT * FROM user WHERE ID=?", [id], function(err, data) {
    if(err) return console.log(err);
     res.render("edit.hbs", {
        user: data[0]
    });
  });
});

app.post("/edit", urlencodedParser, function (req, res) {
         
  if(!req.body) return res.sendStatus(400);
  const firstName = req.body.FirstName;
  const lastName = req.body.LastName;
  const midleName = req.body.MidleName;
  const age = req.body.Age;
  const email = req.body.Email;
  const phone = req.body.Phone;
  const id = req.body.ID;
   
  pool.query("UPDATE user SET FirstName=?, LastName=?, MidleName=?, Age=?, Email=?, Phone=? WHERE ID=?", 
  [firstName, lastName, midleName, age, email, phone, id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});

app.post("/delete/:ID", function(req, res){
          
  const id = req.params.ID;
  pool.query("DELETE FROM user WHERE ID=?", [id], function(err, data) {
    if(err) return console.log(err);
    res.redirect("/");
  });
});
 
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});