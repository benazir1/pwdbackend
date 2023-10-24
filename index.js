const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');


const userController = require('./Controllers/user')
 require('dotenv').config();
 
 const app = express();
const PORT = process.env.PORT;
const DB_URL =process.env.DB_URL;

app.use(cors(
  
  ));
app.use(express.json());

//app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());//for parsing  JSON bodies

//connect to MongoDB
mongoose
  .connect(DB_URL, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDB", err));

  //user signup
  app.post('/signup',userController.signup);//register
  app.post('/signin',userController.signin);//user signin
  app.post('/forgot-password', userController.forgotpassword)
 app.post('/reset-password/:id/:token', userController.resetpassword)
  
app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });