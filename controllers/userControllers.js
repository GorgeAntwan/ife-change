const User = require('../models/user');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const {config}= require('../store/config');
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
   const age = req.body.age;
   const city = req.body.city;
   const inChurch = req.body.inChurch;
   const meetingDate = req.body.meetingDate;
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
          age:age,
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
            // sending email
            return res.status(200).json({message:"Success Sending Email"});
        }
       
     } catch (err) {
        console.log(err);
        const error = new HttpError("can not get Sending Email try again latter",500)
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

