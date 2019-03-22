const User = require('../../models/user');
const bcrypt = require('bcrypt');
const nodeMailer = require('nodemailer');
const nodeMailerTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');

const Transport = nodeMailer.createTransport(nodeMailerTransport({
    auth:{
        api_key:'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'
    }
}))
exports.getLogin = (req, res, next)=>{
    res.render('auth/login', {
        pageTitle : 'Login',
        path: '/auth/login',
        errorMessage:req.flash('error')
    })
}
exports.postLogin = (req, res, next)=>{
    User.findOne({email:req.body.email}).then(user => {
        if(!user){
            //email wrong
            req.flash('error', 'Invalid Email');
            return res.redirect('/auth/login');
        }
        bcrypt.compare(req.body.password, user.password, (err, result)=>{
            if(!result){
                //password wrong
                req.flash('error', 'Invalid Password')
                return res.redirect('/auth/login');
            }
            req.session.userId = user._id;
            req.session.isLoggedIn = true;
            req.session.save(()=>{
                res.redirect('/')
            })
        })        
        
    }).catch(err => {
        return res.redirect('/auth/signup')
    })   
}

exports.getSignup = (req, res, next)=>{
    res.render('auth/signup', {
        pageTitle : 'SignUp',
        path: '/auth/signup',
        errorMessage:req.flash('error')
    })
}
exports.postSignup = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10, (err,hashPassword) => {
        if(err){            
            console.log('+++ Password Ecrypt Issue: +++', err)
        }
        else{
            User.findOne({email:req.body.email}).then(user => {
                if(!user){
                    //new user creation
                    const newUser = new User({email:req.body.email, password:hashPassword, cart:{items:[], subTotal:0}, saveForLater:[]});
                    newUser.save((err)=>{
                    if(err){
                        console.log('+++ Save Session Issue: +++', err)
                    }
                    const mail = {
                        to: req.body.email,
                        from: 'sweetstore@gmail.com',
                        subject: 'Signup successfully!!!',
                        text: 'yop did signup successfully in sweetstore.com',
                        html: '<b>Thank you</b>'
                    }
                    Transport.sendMail(mail, (err, result)=>{
                        if(err){
                            console.log(err)
                        }
                        return res.redirect('/auth/login')
                    } )
                    
                }) 
                }
                else{
                    req.flash('error', 'Email Already Exist!!!');
                    return res.redirect('/auth/signup')
                }
                
            }).catch(err => console.log(err))
        }  
    })
}

exports.postLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/auth/login');
    });
    
}
exports.getPwdReset = (req, res, next)=>{    
    res.render('auth/reset-password', {
        pageTitle : 'Password Reset',
        path: '/auth/reset',
        errorMessage:req.flash('error')
    })
}
exports.postPwdReset = (req, res, next)=>{
    crypto.randomBytes(15, (err, buffer)=>{
        const token = buffer.toString('hex');
        User.findOne({email:req.body.email}).then((user)=>{
            if(!user){
                req.flash('error', 'No Account found this mail');
                return res.redirect('/auth/reset')
            }
            user.resetToken = token;
            user.resetTokenExpire = Date.now() + 3600000;
            user.save((err)=>{
                if(err){
                    console.log(err)
                }
                const mail = {
                    to: req.body.email,
                    from: 'sweetstore@gmail.com',
                    subject: 'Reset Password Link',
                    text: 'yop did reset password in sweetstore.com',
                    html: `<b>please click the following <a href="http://localhost:3000/auth/reset/${token}">link</a> for reset password</b>`
                }
                Transport.sendMail(mail, (err, result)=>{
                    if(err){
                        console.log(err)
                    }
                    return res.redirect('/');
                } )
            })
        }).catch(err=>{
            req.flash('error', 'No Account found this mail')
        })
    })
    
}

exports.getNewPassword = (req, res, next) => {
    User.findOne({resetToken:req.params.token, resetTokenExpire:{$gt:Date.now()}}).then(user => {        
            res.render('auth/new-password', {
            pageTitle : 'New Password',
            path: '/auth/reset/:token',
            errorMessage:req.flash('error'),
            token:req.params.token        
        })
    })
   
}

exports.postNewPassword = (req, res, next) => {
    User.findOne({resetToken:req.body.token, resetTokenExpire:{$gt:Date.now()}}).then(user => { 
        if(!user){
            req.flash('error', 'Token expired. send email for rest password');
            return res.redirect('/auth/reset');
        }
        bcrypt.hash(req.body.password, 10, (err,hashPassword) => {
            if(err){            
                console.log('+++ Password Ecrypt Issue: +++', err)
            }
            console.log(user)
            user.password = hashPassword;
            user.resetToken = undefined;
            user.resetTokenExpire = undefined;
            user.save((err, result)=>{
                if(err){
                    return res.redirect('/auth/reset');
                }else{
                    res.redirect('/auth/login')
                }
            })
        })
    })
}