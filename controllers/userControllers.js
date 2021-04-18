const User = require('../models/user');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {config}= require('../store/config');
const sendGridMail = require('@sendgrid/mail');
const crypto = require('crypto');

const { Op } = require("sequelize");
function getMessage(to,from,subject,body) {
  return {
    to: to,
    from:from,// 'gorgeantwan2022@gmail.com',
    subject: subject,//'Test email with Node.js and SendGrid',
    text: body, 
    html: `<strong>${body}</strong>`,
  }; 
}
 
async function sendEmail(to,from,subject,body) {
  try {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY );
    await sendGridMail.send(getMessage(to,from,subject,body));
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}

exports.login =(async(req,res,next) => {
   const {email, password} = req.body;
   const errors = validationResult(req); 
   if (!errors.isEmpty()) {
       
      
       return res.status(422).json(errors);//
   }
   try {
       const user = await User.findOne({where: {email: email}});
       if (user ===null){
        const error = new HttpError("email does not exist try signup instead",422);
        return next(error);  
       }else{
            if(await bcrypt.compare(password,user.password)){
                
                 //  const  userWithOutPassword =  await User.findByPk(user.id,{attributes:{exclude:['password']}});
                //console.log("🚀 ~ file: userControllers.js ~ line 27 ~ exports.login= ~ config", config);
                const token = jwt.sign({ email }, config.passport.secret,         
                {
                  expiresIn: 1000000,
                });
                const userToReturn = { ...user.toJSON(), ...{ token } };
                delete userToReturn.password;
                res.status(200).json(userToReturn);
            }else{
                const error = new HttpError("Password is not Correct",422);
                  return next(error);  
            }
       }
   } catch (err) {
       console.log(err);
        const error = new HttpError("can not login try again latter",422);
        return next(error); 
   }
});

exports.register=(async(req,res,next) => {

   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   //const passwordConfirmation = req.body.passwordConfirmation;
   const phone =req.body.phone;
   const status = req.body.status;
   const birthdate = req.body.birthdate;
   const city = req.body.city;
   const inChurch = req.body.inChurch;
   const meetingDate = req.body.meetingDate;
   // to compute age by using birthdate
  //  var date1 = new Date(birthdate);
  //  var date2 = new Date();
     
  //  // To calculate the time difference of two dates
  //  var Difference_In_Time = date2.getTime() - date1.getTime();
  //  var Difference_In_year = Math.floor(Difference_In_Time / (1000 * 3600 * 24*365));
  //  console.log("🚀 ~ file: userControllers.js ~ line 92 ~ exports.register= ~ Difference_In_Days", Difference_In_year)
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
       
      
       return res.status(422).json(errors);//
   }
     
  try {
    const user = await User.findOne({where:{email:email}});
   
    if(user ===null){ // if not found user will create new user;
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword  =await bcrypt.hash(password,salt);
        const newUser = await User.create({
          name: name,
          email:email,
          password:hashedPassword,
          phone:phone,
          status:status,
          birthdate:birthdate,
          city:city,
          inChurch:inChurch,
          meetingDate:meetingDate,    
        });
         
        const token = jwt.sign({ email }, config.passport.secret, {
      
            expiresIn: 10000000,
          });
          const returnUser = {...newUser.toJSON(),...{token} };
          delete returnUser.password;
        return res.status(201).json(returnUser);
      } catch (err) {
        const error = new HttpError("can not sinup try again latter",422);
        return next(error);  
      }
    }else{
        const error = new HttpError("email already exist try login instead",422);
        return next(error);  
    }
    
  } catch (err) {

    console.log(err);
    const error = new HttpError("can not sinup try again latter",500)
    return next(error);
  }
});

exports.profile=(async(req,res,next) => {
     
    const userId = req.user.id;
    console.log("🚀 ~ file: userControllers.js ~ line 108 ~ exports.profile= ~ userId", userId)
    
    try {
        const user = await User.findByPk(userId,{attributes:{exclude:['password']}});
       return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        const error = new HttpError("can not get Your Profile try again latter",500)
        return next(error);
    }
});

exports.forgetPassword=(async(req,res,next) => {
      // sending email
      const email = req.body.email;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          
          
          return res.status(422).json(errors);//
      }
     try {
        const user = await User.findOne({where:{email:email}});
        if(user===null){
            const error = new HttpError("email does not exist try write it Correctly or sign up instead",422);
            return next(error);  
        }else{ 
          crypto.randomBytes(32,async(err ,buffer) => {
            if(err){
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(error);
            }
            const token =buffer.toString('hex');
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; 
            await user.save();
          });
            // sending email
          
            (async () => {
              console.log('Sending test email');
              await sendEmail(
                email,
                'gorgeantwan2022@gmail.com',
                'Rest Passwrod',
                '<a href="http://localhost:3000/reset/${token}">Click her</a> to rest your password in Life Change'
              );
            })();

            return res.status(200).json({message:"Success Sending Email"});
        }
       
     } catch (err) {
        console.log(err);
        const error = new HttpError("can not get Sending Email try again latter",500)
        return next(error);
    }
});
exports.setNewPassword=(async (req,res,next)=>{
  const newPassword = req.body.newpassword;
  console.log("🚀 ~ file: userControllers.js ~ line 206 ~ exports.setNewPassword= ~ newPassword", newPassword)
  const passwordToken = req.body.passwordToken;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      
      
      return res.status(422).json(errors);//
  }
  try {
    const user = await User.findOne({
      where:{
            resetToken:passwordToken,
            resetTokenExpiration:{
            [Op.gt]:Date.now()
           }
    }});
    console.log("🚀 ~ file: userControllers.js ~ line 221 ~ exports.setNewPassword= ~ user", user)
    if(!user){
         return res.status(401).json({message:"unauthorized"});
    }
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword  =await bcrypt.hash(newPassword,salt);
    user.password =hashedPassword;
    await user.save();
    return res.status(201).json({message:"password change successfully"})
  } catch (err) {
    console.log(err);
    const error = new HttpError(error,500)
    return next(error);
  }
});
exports.changePassword=(async(req,res,next) => {
    const userId = req.user.id;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        
        
        return res.status(422).json(errors);//
    }
     
    try {
        const user = await User.findByPk(userId);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword  =await bcrypt.hash(password,salt);
        user.password = hashedPassword;
        user.save();
       return res.status(201).json({message: 'Success Change Password'});
    } catch (err) {
        console.log(err);
        const error = new HttpError("can not change Your Password try again latter",500)
        return next(error);
    }
});

