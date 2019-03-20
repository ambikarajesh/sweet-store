const Product = require('../../models/product');
const User = require('../../models/user');
const Order = require('../../models/order');
exports.getIndex= async(req, res, next)=>{
    res.render('shop/home', {
        pageTitle : 'Shop',
        path: '/',
        isAuthorized:req.session.isLoggedIn
    })
}

exports.getProducts = (req, res, next)=>{
    Product.find().then(products => {
        res.render('shop/product-list', {
            pageTitle : 'Products',
            path: '/products',
            products:products,
            isAuthorized:req.session.isLoggedIn
        });
    })
}

exports.getProduct = (req, res, next)=>{
    Product.findById(req.params.productId).then(product => {
        res.render('shop/product-detail', {
            pageTitle : 'Products',
            path: '/products',
            product:product,
            isAuthorized:req.session.isLoggedIn
        })
    }).catch(err => {
        console.log(err)
    });    
}

exports.getCart = (req, res, next)=>{
    User.findOne({_id:req.user._id}).populate('cart.items.productId saveForLater.productId').then(user => {        
        res.render('shop/cart', {
            pageTitle : 'My Cart',
            path: '/cart',
            items: user.cart.items,
            products: user.saveForLater,
            subTotal: user.cart.subTotal,
            isAuthorized:req.session.isLoggedIn
        })
    })        
}

exports.addProducttoCart = async(req, res, next) =>{ 
    req.user.addToCart(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');  
    })
}

exports.DecreaseCartItem = async(req, res, next) => {
    req.user.decItem(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');       
    })
}

exports.IncreaseCartItem = async(req, res, next) => {
    req.user.incItem(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');       
    })
}

exports.deleteCartItem = async(req, res, next) => {
    req.user.deleteCartItem(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');       
    })
}


exports.moveToCartItem = async(req, res, next) => {
    req.user.moveToCartItem(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');       
    })
}

exports.saveForLaterItem = async(req, res, next) => {
    req.user.saveLaterItem(req.body.productId, req.body.price).then(() => {
        res.redirect('/cart');       
    })
}

exports.deleteSaveLaterItem = async(req, res, next) => {
    req.user.deleteSaveLaterItem(req.body.productId).then(() => {
        res.redirect('/cart');       
    })
}

exports.getOrders = (req, res, next)=>{
    Order.find({userId:req.user._id}).populate('items.productId userId', 'name price image quantity').then(orders =>{
        
        res.render('shop/orders', {
            pageTitle : 'My Orders',
            path: '/orders',
            orders:orders,
            isAuthorized:req.session.isLoggedIn
        })
    }).catch(err => console.log(err))
}

exports.getCheckout = (req, res, next)=>{
    req.user.populate('cart.items.productId').execPopulate().then(user => {  
        const orderItems = user.cart.items.map(item => {
            return {productId:item.productId, quantity:item.quantity}
        })
        const order = new Order({
            items:orderItems,
            userId: user._id,
            total:user.cart.subTotal
        })
        user.clearCartItems().then(()=>{
            return order.save(); 
        }) 
    }).then(()=>{
        res.render('shop/checkout', {
            pageTitle : 'Checkout',
            path: '/checkout',
            isAuthorized:req.session.isLoggedIn
        })
    })  
}