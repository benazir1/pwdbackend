
const UserModel = require('../models/user');
const nodemailer =require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



module.exports.signup = async (req, res) => {
    const { email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 2);
  
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
  
    res.json({ token });
  }



module.exports.sendotp = async (req,res) =>{
    console.log(req.body);
    const _otp = Math.floor(100000+ Math.random() *900000)
   console.log(_otp);

   let user = await  UserModel.findOne({ email: req.body.email})
   if(!user){
    res.send({ code: 500, message: 'user not found' })
   }
   let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
     let info = await transporter.sendMail({
       from: 'benazir1989@gmail.com',
        to: req.body.email, // list of receivers
        subject: "OTP", // Subject line
        text: String(_otp),
        html: `<html>
            < body >
            Hello and welcome
        </ >
       </html > `,
    })
if (info.messageId) {

        console.log(info, 84)
        UserModel.updateOne({ email: req.body.email }, { otp: _otp })
            .then(result => {
                res.send({ code: 200, message: 'otp send' })
            })
            .catch(err => {
                res.send({ code: 500, message: 'Server err' })

            })

    } else {
        res.send({ code: 500, message: 'Server err' })
    }
}   



module.exports.submitotp = async (req, res) => {
    console.log(req.body)
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 2);
   //  const pwd = new UserModel({ password: hashedPassword });

    UserModel.findOne({ otp: req.body.otp }).then(result => {

        //  update the password 
        
        UserModel.updateOne({ email: result.email }, { password: hashedPassword })
            .then(result => {
                res.send({ code: 200, message: 'Password updated' })
            })
            .catch(err => {
                res.send({ code: 500, message: 'Server err' })

            })


    }).catch(err => {
        res.send({ code: 500, message: 'otp is wrong' })

    })


}