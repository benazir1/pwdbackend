const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const bcrypt = require("bcrypt");
const userController = require('./Controllers/user')

 require('dotenv').config();
 
 const app = express();
const PORT = process.env.PORT;
const DB_URL =process.env.DB_URL;

app.use(cors());
//app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());//for parsing  JSON bodies

//connect to MongoDB
mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

  //user signup
  app.post('/signup',userController.signup);
  app.post('/signin',userController.signin);//user signin
  app.post('/submit-otp', userController.submitotp)
 app.post('/send-otp', userController.sendotp)
  
app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });