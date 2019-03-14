
const ProductsModel = require('../../models/productsModel');
const productsModel = new ProductsModel();
const UsersModel = require('../../models/usersModel');
const usersModel = new UsersModel();

exports.getIndex= async(req, res, next)=>{
    res.render('shop/home', {
        pageTitle : 'Shop',
        path: '/',
    })
}
exports.getProducts = (req, res, next)=>{
    productsModel.fetchProducts().then(products => {
        res.render('shop/product-list', {
            pageTitle : 'Products',
            path: '/products',
            products:products
    });
})
}
exports.getProduct = (req, res, next)=>{
    productsModel.fetchProduct(req.params.productId).then(product => {
        res.render('shop/product-detail', {
            pageTitle : 'Products',
            path: '/products',
            product:product
        })
    }).catch(err => {
        console.log(err)
    });
    
}


exports.getCart = async(req, res, next)=>{
    usersModel.fetchCartProduct(req.user).then(cart => {
        res.render('shop/cart', {
            pageTitle : 'My Cart',
            path: '/cart',
            items: cart.items,
            products:cart.saveForLater,
            subTotal:cart.subTotal
        })
    }).catch(err => console.log(err))
        
}

exports.addProducttoCart = async(req, res, next) =>{
    productsModel.fetchProduct(req.body.productId).then(product => {
        usersModel.addProductToCart(product, req.user).then(()=>{
            res.redirect('/cart');
        })        
    }).catch(err => {
        console.log(err)
    });   
}

exports.deleteCartItem = async(req, res, next) => {
    usersModel.removeCartItem(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    })
    
}
exports.DecreaseCartItem = async(req, res, next) => {
    usersModel.DecreaseItem(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    }).catch(err=> console.log(err))
}
exports.IncreaseCartItem = async(req, res, next) => {
    usersModel.IncreaseItem(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    }).catch(err=> console.log(err))
}


exports.moveToCartItem = async(req, res, next) => {
    usersModel.moveItemToCart(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    }).catch(err=> console.log(err))
}

exports.saveForLaterItem = async(req, res, next) => {
    usersModel.saveLaterItem(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    }).catch(err=> console.log(err))
}
exports.deleteSaveLaterItem = async(req, res, next) => {
    usersModel.deleteSaveItem(req.body.productId, req.user).then(()=>{
        res.redirect('/cart');
    }).catch(err=> console.log(err))
}



exports.getOrders = (req, res, next)=>{
    usersModel.fetchOrders(req.user).then(orders=>{
        console.log(orders)
        res.render('shop/orders', {
            pageTitle : 'My Orders',
            path: '/orders',
            orders:orders
        })
    }).catch(err => console.log(err))
}
exports.getCheckout = (req, res, next)=>{
    usersModel.orderItems(req.user).then(()=>{
        res.render('shop/checkout', {
            pageTitle : 'Checkout',
            path: '/checkout'
        })
    }).catch(err => console.log(err))
}