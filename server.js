const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const shopRouter = require('./routes/shop/shop');
const adminRouter = require('./routes/admin/admin')
const errorController = require('./controller/error')

const Users = require('./models/usersModel');

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    Users.findById('5c8b5acfdf29351e281473ae').then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))    
})

app.use('/', shopRouter)
app.use('/admin', adminRouter)
app.use(errorController.error404)

mongoose.connect(encodeURI('mongodb+srv://Ambika:Dec%401986@cluster0-btzl5.mongodb.net/shop?retryWrites=true')).then(result => {
    Users.findOne().then(user => {
        if(!user){
            const user = new Users({name:'Ambika', email:'ambikul@gmail.com', cart:{items:[], subTotal:0, saveForLater:[]}})
            user.save();
        }
    })
    app.listen(PORT, ()=>{
        console.log(`Server Start in port ${PORT}`);
    })
}).catch(err =>console.log(err))



