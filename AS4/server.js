/********************************************************************************
* WEB322 – Assignment 04
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: ___Jie Xu__________ Student ID: ___133286229___ Date: __2023-11-10__
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require("path");

const express = require('express');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render(path.join(__dirname, "/views/home.ejs"));
});

app.get('/about', (req, res) => {
  res.render(path.join(__dirname, "/views/about.ejs"));
});

app.get("/lego/sets", async (req,res)=>{

  try{
    if(req.query.theme){
      let sets = await legoData.getSetsByTheme(req.query.theme);
      res.render("sets", {set: sets}); 
  
    }else{
      let sets = await legoData.getAllSets();
      res.render("sets", {set: sets}); 
    }
  }catch(err){
    res.status(404).render("404", {message: "I'm sorry, we're unable to find requested sets."});
  }

});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", {set: set});
  }catch(err){
    res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
  }
});

app.use((req, res, next) => {
  res.status(404).render(path.join(__dirname, "/views/404.ejs"));
});


legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
});