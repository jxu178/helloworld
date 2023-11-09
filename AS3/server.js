
/********************************************************************************
* WEB322 – Assignment 03
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: _____Jie Xu____ Student ID: __133286229__ Date: __2023-10-26
*
* Published URL: ____https://github.com/jxu178/helloworld.git___________________
*
********************************************************************************/
const path = require('path');

const express = require('express');
const legoData = require('./modules/legoSets');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;


function serverStart() {


  // Initialize legoSets at the beginning
  legoData.Initialize();

  //static files
  app.use(express.static('public'));
  // following routes

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  });

  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
  });

  app.get('/lego/sets', async (req, res) => {
    const theme = req.query.theme;
    if (theme) {
      // Handle theme-specific logic
      const sets = await legoData.getSetsByTheme(theme);
      res.json(sets);
    } else {
      // Handle unfiltered Lego data
      const sets = await legoData.getAllSets();
      res.json(sets);
    }
  });

  app.get('/lego/sets/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    try {
      const set = await legoData.getSetByNum(setNum);
      res.json(set);
    } catch (error) {
      res.status(404).send(error);
    }
  });

  // 404 Error handling
  app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  });
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
  });
}

//run functions to start the server
serverStart();