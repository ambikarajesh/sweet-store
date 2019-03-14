exports.error404 = (req,res, next)=>{
    res.render('error',{
        pageTitle: 'Page Not Found',
        path: ''
    })
}