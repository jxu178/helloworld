// modules/auth-service.js
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String,
  }],
});

let User; // to be defined on new connection (see initialize)

module.exports = {
  initialize: function () {
    return new Promise(function (resolve, reject) {
      const db = mongoose.createConnection(process.env.MONGODB);

      db.on('error', (err) => {
        reject(err);
      });

      db.once('open', () => {
        User = db.model("users", userSchema);
        resolve();
      });
    });
  },

  registerUser: function (userData) {
    return new Promise(function (resolve, reject) {
      if (userData.password !== userData.password2) {
        reject("Passwords do not match");
      } else {
        // Hash the password using bcrypt
        bcrypt.hash(userData.password, 10)
          .then((hash) => {
            const newUser = new User({
              userName: userData.userName,
              password: hash, // Store the hashed password in the database
              email: userData.email,
            });

            newUser.save()
              .then(() => resolve())
              .catch((err) => {
                if (err.code === 11000) {
                  reject("User Name already taken");
                } else {
                  reject("There was an error encrypting the password");
                }
              });
          })
          .catch((err) => {
            console.log(err);
            reject("There was an error encrypting the password");
          });
      }
    });
  },

  checkUser: function (userData) {
    return new Promise(function (resolve, reject) {
      User.find({ userName: userData.userName })
        .then((users) => {
          if (users.length === 0) {
            reject(`Unable to find user: ${userData.userName}`);
          } else if (users[0].password !== userData.password) {
            reject(`Incorrect Password for user: ${userData.userName}`);
          } else {
            if (users[0].loginHistory.length === 8) {
              users[0].loginHistory.pop();
            }

            users[0].loginHistory.unshift({
              dateTime: new Date(),
              userAgent: userData.userAgent,
            });

            User.updateOne({ userName: users[0].userName }, { $set: { loginHistory: users[0].loginHistory } })
              .then(() => resolve(users[0]))
              .catch((err) => reject(`There was an error verifying the user: ${err}`));
          }
        })
        .catch(() => reject(`Unable to find user: ${userData.userName}`));
    });
  },
};
