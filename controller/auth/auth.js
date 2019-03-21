const User = require('../../models/user');
const bcrypt = require('bcrypt');
exports.getLogin = (req, res, next)=>{
    res.render('auth/login', {
        pageTitle : 'Login',
        path: '/auth/login'
    })
}
exports.postLogin = (req, res, next)=>{
    User.findOne({email:req.body.email}).then(user => {
        if(!user){
            //email wrong
            console.log('+++ Email Fail: +++', err)
            return res.redirect('/auth/login');
        }
        bcrypt.compare(req.body.password, user.password, (err, result)=>{
            if(!result){
                //password wrong
                console.log('+++ Password Fail: +++', err)
                return res.redirect('/auth/login');
            }
            req.session.userId = user._id;
            req.session.isLoggedIn = true;
            req.session.save(()=>{
                res.redirect('/')
            })
        })        
        
    }).catch(err => {
        console.log('+++ No user found using Email: +++')
        return res.redirect('/auth/signup')
    })   
}

exports.getSignup = (req, res, next)=>{
    res.render('auth/signup', {
        pageTitle : 'SignUp',
        path: '/auth/signup'
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
                    return res.redirect('/auth/login')
                }) 
                }
                else{
                    console.log('+++ Email already Used +++');
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