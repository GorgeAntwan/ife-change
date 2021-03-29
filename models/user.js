const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const User = sequelize.define('user',{
    
    id:{
         type:Sequelize.INTEGER,
         allowNull:false,
         primaryKey:true,
         autoIncrement:true,
    },
    name:{
         type:Sequelize.STRING,
         allowNull:false,
     },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    phone:{
        type:Sequelize.INTEGER(14),
        allowNull:false,
    },
    age:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    city:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    status :{
        type:Sequelize.STRING,
        allowNull:false,
    },
    inChurch:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
    },
    meetingDate:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    role:{
        type:Sequelize.INTEGER,
        defaultValue:0,
    }
    



});

module.exports =User;