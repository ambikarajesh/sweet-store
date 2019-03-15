
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
   res.render('shop/cart', {
        pageTitle : 'My Cart',
        path: '/cart',
        items: req.user.cart.items,
        products: req.user.cart.saveForLater,
        subTotal: req.user.cart.subTotal
    })
        
}

exports.addProducttoCart = async(req, res, next) =>{
    ProductsModel.findById(req.body.productId).then(product => {
        req.user.addToCart(product).then(() => {
            res.redirect('/cart');       
        })
    }).catch(err => {
        console.log(err)
    });   
}

exports.DecreaseCartItem = async(req, res, next) => {
    req.user.decItem(req.body.productId).then(() => {
            res.redirect('/cart');       
    }).catch(err =>console.log(err))
}
exports.IncreaseCartItem = async(req, res, next) => {
    req.user.incItem(req.body.productId).then(() => {
        res.redirect('/cart');       
}).catch(err =>console.log(err))
}

exports.deleteCartItem = async(req, res, next) => {
    req.user.deleteCartItem(req.body.productId).then(() => {
        res.redirect('/cart');       
    }).catch(err =>console.log(err))    
}



exports.moveToCartItem = async(req, res, next) => {
    req.user.moveToCartItem(req.body.productId).then(() => {
        res.redirect('/cart');       
    }).catch(err =>console.log(err))  
}

exports.saveForLaterItem = async(req, res, next) => {
    req.user.saveLaterItem(req.body.productId).then(() => {
        res.redirect('/cart');       
    }).catch(err =>console.log(err))  
}
exports.deleteSaveLaterItem = async(req, res, next) => {
    req.user.deleteSaveLaterItem(req.body.productId).then(() => {
        res.redirect('/cart');       
    }).catch(err =>console.log(err)) 

}

exports.getOrders = (req, res, next)=>{
    console.log(req.user.orders)
    res.render('shop/orders', {
            pageTitle : 'My Orders',
            path: '/orders',
            orders:req.user.orders
        })
}
exports.getCheckout = (req, res, next)=>{
    req.user.orderItems().then(()=>{
        res.render('shop/checkout', {
            pageTitle : 'Checkout',
            path: '/checkout'
        })
    }).catch(err => console.log(err))
}