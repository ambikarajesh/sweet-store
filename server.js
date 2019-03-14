const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const shopRouter = require('./routes/shop/shop');
const adminRouter = require('./routes/admin/admin')
const errorController = require('./controller/error')

const MongoConnect = require('./util/database').mongoConnect;
const Users = require('./models/usersModel');
const users= new Users();
const PORT = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    //users.storeUser({name:'Ambika', email:'ambikula@gmil.com', cart:{items:[],subTotal:0,saveForLater:[]}})
    users.findUser('5c8912159ea70a08eca0df9e').then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err))    
})

app.use('/', shopRouter)
app.use('/admin', adminRouter)
app.use(errorController.error404)

MongoConnect(() => {
    app.listen(PORT, ()=>{
        console.log(`Server Start in port ${PORT}`);
    })
})

