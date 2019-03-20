const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
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
    uri:'mongodb+srv://Ambika:Dec%401986@cluster0-btzl5.mongodb.net/shop',
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
                }))
app.use((req,res,next)=>{
    if(!req.session.userId){
        return next();
    }
    User.findById(req.session.userId).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
})
app.use('/', shopRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use(errorController.error404);

mongoose.connect(encodeURI('mongodb+srv://Ambika:Dec%401986@cluster0-btzl5.mongodb.net/shop?retryWrites=true')).then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new Users({name:'Ambika', email:'ambikul@gmail.com', cart:{items:[], subTotal:0}, saveForLater:[], orders:[]})
            user.save();
        }
    })
    app.listen(PORT, ()=>{
        console.log(`Server Start in port ${PORT}`);
    })
}).catch(err =>console.log(err))



