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
        .isLength({ min: 11,max:12 }).withMessage('phone not correct formate'),
        check('inChurch')
        .not()
        .isEmpty(),
        check('age')
        .not()
        .isEmpty(),
        check('city')
        .not()
        .isEmpty(),
        check('status')
        .not()
        .isEmpty(),
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

module.exports =router;