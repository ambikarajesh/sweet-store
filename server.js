const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const morgan = require('morgan');
const mongoDbSessionStore = require('connect-mongodb-session')(session);
const shopRouter = require('./routes/shop/shop');
const adminRouter = require('./routes/admin/admin');
const authRouter = require('./routes/auth/auth')
const errorController = require('./controller/errors/errors');
const User = require('./models/user');
dotenv.config();
const mongoDB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0-btzl5.mongodb.net/${process.env.MONGO_DATABASE}`;

const app = express();
const PORT = process.env.PORT || 3000;
const store = new mongoDbSessionStore({
    uri:mongoDB_URI,
    collection:'sessions'
})
var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const now = new Date().toISOString(); 
        const date = now.replace(/:/g, '-'); 
        cb(null, date +'-'+file.originalname); 
    }
  })
const fileFilter = (req, file, cb) =>{
    if(file.mimetype ==='image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'))
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
        if(!user){
            throw new Error('User deleted form Database'); 
        }
        req.user = user;
        next();
    }).catch(err => {
        return req.session.destroy((err)=>{                  
            return res.redirect('/auth/login');
        });
    })
       
})


app.use((req,res,next)=>{
    res.locals.isAuthorized = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use('/', shopRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/500', errorController.error500);
app.use(errorController.error404);

// error-handling middleware
app.use((error, req, res, next)=>{
    console.log(error)
    res.redirect('/500')
})

mongoose.connect(encodeURI(mongoDB_URI)).then(result => {   
    app.listen(PORT, ()=>{
        console.log(`Server Start in port ${PORT}`);
    })
}).catch(err =>console.log(err))



