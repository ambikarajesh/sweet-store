
const ProductsModel = require('../../models/productsModel');
const UsersModel = require('../../models/usersModel');

exports.getIndex= async(req, res, next)=>{
    res.render('shop/home', {
        pageTitle : 'Shop',
        path: '/',
    })
}
exports.getProducts = (req, res, next)=>{
    ProductsModel.find().then(products => {
        res.render('shop/product-list', {
            pageTitle : 'Products',
            path: '/products',
            products:products
    });
})
}
exports.getProduct = (req, res, next)=>{
    ProductsModel.findById(req.params.productId).then(product => {
        res.render('shop/product-detail', {
            pageTitle : 'Products',
            path: '/products',
            product:product
        })
    }).catch(err => {
        console.log(err)
    });
    
}


exports.getCart = (req, res, next)=>{
    UsersModel.findOne({_id:req.user._id}).populate('cart.items.productId saveForLater.productId').then(user => {        
        res.render('shop/cart', {
            pageTitle : 'My Cart',
            path: '/cart',
            items: user.cart.items,
            products: user.saveForLater,
            subTotal: user.cart.subTotal
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
    UsersModel.findOne({_id:req.user._id}).populate('orders.orderItems.productId').then(user => { 
        res.render('shop/orders', {
            pageTitle : 'My Orders',
            path: '/orders',
            orders:user.orders
        })
    }).catch(err => console.log(err))
}
exports.getCheckout = (req, res, next)=>{
    req.user.orderItems().then(()=>{
        res.render('shop/checkout', {
            pageTitle : 'Checkout',
            path: '/checkout'
        })
    }).catch(err => console.log(err))
}