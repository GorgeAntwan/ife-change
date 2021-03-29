const { Strategy, ExtractJwt }  = require( 'passport-jwt');
const  {config}  =require( './config');
const User =  require('../models/user');

exports.applyPassportStrategy = passport => {

  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = config.passport.secret;
  
  passport.use(
    new Strategy(options,async (payload, done) => {
    
      
     await User.findOne({where:{ email: payload.email }}).then((user, err) => {
      
        
        if (err) {
      
          
          return done(err, false)};
        if (user) {
          
          return done(null, {
            email: user.email,
            id: user.id
          });  
        }
        if(!user){
          return done(null, false, { message: 'Incorrect username.' });
        }
        console.log("🚀 ~ file: passport.js ~ line 18 ~ awaitUser.findOne ~ err", err)
        return done(null, false);
      });
    })
  );
};
