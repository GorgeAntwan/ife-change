const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const path =require('path');
const app = express();
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./utils/database');
const config=require('./store/config');
const logger = require('winston');
const passport = require('passport');
const dotenv = require('dotenv');


var cors = require('cors')
 
const {applyPassportStrategy} =require('./store/passport');
// Set up CORS
app.use(cors());
dotenv.config(); 
// Apply strategy to passport
applyPassportStrategy(passport);

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

/**
 * // to allow access 
app.use((req,res,next)=>{
console.log("🚀 ~ file: app.js ~ line 33 ~ dotenv", dotenv)
console.log("🚀 ~ file: app.js ~ line 32 ~ dotenv", dotenv)
console.log("🚀 ~ file: app.js ~ line 32 ~ dotenv", dotenv)
console.log("🚀 ~ file: app.js ~ line 32 ~ dotenv", dotenv)
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,Origin,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PATCH');
  next();
});
*/

app.use('/api/users',userRoutes);

// if user requst url not exist
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });
  
app.use((error, req, res, next) => {
    if(req.file){
      fs.unlink(req.file.path,err =>{
        console.log(err);
      })
    }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });
sequelize
.sync()
//.sync({ alter: true })// when you want to change spesific column in table
//.sync({force: true}) 
.then(result=>{
  console.log(result);
  app.listen(3000);
})
.catch((error) =>{
    console.log(error);
})
