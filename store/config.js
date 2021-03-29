exports.config = {
    passport: {
      secret: "LIFE_CHANGE_SECRET_KEY",
      expiresIn: 10000,
    },
    env: {
     /**
      *  port: 3000,
      mongoDBUri: 'mongodb://localhost/test',
      mongoHostName: process.env.ENV === 'prod' ? 'mongodbAtlas' : 'localhost',
      */
    },
  };