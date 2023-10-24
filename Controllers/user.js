
const UserModel = require('../models/user');
const nodemailer =require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



module.exports.signup = async (req, res) => {
    const { email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new UserModel({ email, password: hashedPassword });
  
    try {
      await user.save();
      res
      .status(200)
      .json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "An error occurred while registering the user" });
    }
  }



module.exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email });
  
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
  
    const passwordMatch = bcrypt.compare(password, user.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }
  
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
        
    });
  
    res.json({ token,email });
  }






  module.exports.resetpassword = async (req, res) => {
    console.log(req.body)
    const{id,token} =req.params;
    const { password } = req.body;

    const hashedPassword =await  bcrypt.hash(password, 10);
   jwt.verify(token, process.env.SECRET_KEY, (err,decoded)=>{
     console.log(hashedPassword)
      if(err){
        return res.json({status:"Error with token"})
      }
      
       
          
        UserModel.findByIdAndUpdate({_id:id} , { password: hashedPassword })
            .then(result => {
                res.send({ code: 200, message: 'Password updated' })
            })
            .catch(err => {
                res.send({ code: 500, message: 'Server err' })

            })

         
    })
  
}

module.exports.forgotpassword = async (req, res) => {
  const {email} =req.body;
  const user = await UserModel.findOne({ email });


  if (!user) {
    return res.status(401).json({ message: "user not exits" });
  }
  const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:"1h"});


  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });
  
  var mailOptions = {
    from: 'noorulshihabudeen@gmail.com',
    to: req.body.email,
    subject: 'Reset your password',
    text: `https://spectacular-liger-e3a997.netlify.app/reset-password/${user._id}/${token}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      res.send({ code: 200, message: 'success' })
    }
  });
}
