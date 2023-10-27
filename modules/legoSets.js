/********************************************************************************
* WEB322 – Assignment 02
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 

* Name:Jie Xu     Student ID: 133286229    Date: 2023-10-16
*
********************************************************************************/


const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

function Initialize() {
    return new Promise((resolve, reject) => {
      
      setData.forEach((set) => {
        const themeInfo = themeData.find((theme) => theme.id === set.theme_id);
        if (themeInfo) {
          set.theme = themeInfo.name;
          sets.push(set);
        } else{
            return null;
        }
      });
  
      resolve(); 
    });
  }

  function getAllSets() {
    return new Promise((resolve, reject) => {
      if (sets.length > 0) {
        resolve(sets); 
      } else {
        reject("No sets available.");
      }
    });
  }

  function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const set = sets.find((set) => set.set_num === setNum);
      if (set) {
        resolve(set); 
      } else {
        reject("Unable to find the requested set.");
      }
    });
  }

  function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const matchingSets = sets.filter((set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );
      if (matchingSets.length > 0) {
        resolve(matchingSets); 
      } else {
        reject("Unable to find requested sets.");
      }
    });
  }

  module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme }
