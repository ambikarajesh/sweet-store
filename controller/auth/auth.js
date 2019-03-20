const User = require('../../models/user');

exports.getLogin = (req, res, next)=>{
    res.render('auth/login', {
        pageTitle : 'Login',
        path: '/auth/login',
        isAuthorized:req.session.isLoggedIn
    })
}
exports.postLogin = (req, res, next)=>{
    User.findById('5c8fe97e0a94f702982fb5d0').then(user => {
        req.session.userId = user._id;
        req.session.isLoggedIn = true;
        req.session.save(()=>{
            res.redirect('/')
        })
        
    }).catch(err => console.log(err))   
}

exports.postLogout = (req, res, next)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/auth/login');
    });
    
}