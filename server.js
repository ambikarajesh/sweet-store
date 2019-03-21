const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoDbSessionStore = require('connect-mongodb-session')(session);
const shopRouter = require('./routes/shop/shop');
const adminRouter = require('./routes/admin/admin');
const authRouter = require('./routes/auth/auth')
const errorController = require('./controller/error');

const User = require('./models/user');


const app = express();
const MongoDB_URI = 'mongodb+srv://Ambika:Dec%401986@cluster0-btzl5.mongodb.net/shop';
const PORT = 3000;
const store = new mongoDbSessionStore({
    uri:MongoDB_URI,
    collection:'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
                    secret:'auth login', 
                    resave:false, 
                    saveUninitialized:false, 
                    store:store
                }));
app.use(csrf());
app.use(flash())
app.use((req,res,next)=>{
    if(!req.session.userId){
        return next();
    }
    User.findById(req.session.userId).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
})


app.use((req,res,next)=>{
    res.locals.isAuthorized = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use('/', shopRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use(errorController.error404);

mongoose.connect(encodeURI(MongoDB_URI)).then(result => {   
    app.listen(PORT, ()=>{
        console.log(`Server Start in port ${PORT}`);
    })
}).catch(err =>console.log(err))



