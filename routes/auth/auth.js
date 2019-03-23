const express = require('express');
const {check, body} = require('express-validator/check');
const router = express.Router();

const authController = require('../../controller/auth/auth');
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', [check('email').isEmail().withMessage('Please Enter Valid Email !!!'), 
                        body('password', 'Please Enter Password which contains letters, numbers and aleast 6 characters').isLength({min:6, max:8}).isAlphanumeric(), 
                        check('confirmPassword').custom((value, {req})=>{
                            if(value!==req.body.password){
                                throw new Error("Password Don't Match!!!")
                            } 
                            return true;
                        })], authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getPwdReset);
router.post('/reset', authController.postPwdReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/reset/newpassword', authController.postNewPassword);
module.exports = router;