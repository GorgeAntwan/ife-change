const express = require('express');
const router =express.Router();
const userController =  require('../controllers/userControllers');
const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const {config} = require('../store/config');
const passport = require('passport');
const HttpError = require('../models/http-error');

router.post('/login',

        check('email')
        .normalizeEmail()  
        .isEmail(),
        check('password').exists()
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
userController.login);

router.post('/register',
        check('name')
        .not()
        .isEmpty(),
        check('email')
        .normalizeEmail()  
        .isEmail(),
        check('password').exists()
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
        check(
            'passwordConfirmation',
            'passwordConfirmation field must have the same value as the password field',
          )
        .exists()
        .custom((value, { req }) => value === req.body.password),
        check('phone')
        .not()
        .isEmpty()
        .isLength({ min: 11,max:12 }).withMessage('phone not correct formate').withMessage('please enter a valid phone number'),
        check('inChurch')
        .not()
        .isEmpty(),
        check('birthdate')
        .isDate({format:'yyyy-mm-dd'})
        .not().isEmpty(),//.withMessage('Please ,Enter vaild Birth Date')
        check('city')
        .not()
        .isEmpty().withMessage('Please ,Enter vaild City'),
        check('status')
        .not()
        .isEmpty().withMessage('Please ,Enter vaild Status'),
userController.register);

router.get('/profile',
passport.authenticate('jwt', { session: false } ),

userController.profile);

router.post('/change-password',
   check('password').exists()
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
        check(
            'passwordConfirmation',
            'passwordConfirmation field must have the same value as the password field',
          )
        .exists()
        .custom((value, { req }) => value === req.body.password),
        passport.authenticate('jwt', { session: false } ),
userController.changePassword);

router.post('/forget-password',
        check('email')
        .normalizeEmail()  
        .isEmail(),
    userController.forgetPassword);
router.post('/set-newpassword',
check('newpassword').exists()
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number'),
        check('passwordToken').exists()
        .withMessage('enter vaild token'),
         
        
userController.setNewPassword)
module.exports =router;