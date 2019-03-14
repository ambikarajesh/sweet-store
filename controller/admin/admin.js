
const ProductsModel = require('../../models/productsModel');
const productsModel = new ProductsModel();
const UsersModel = require('../../models/usersModel');
const usersModel = new UsersModel();
//admin openadd-product page for adding new product
//get of add-product page
exports.addProduct = (req, res, next)=>{    
    res.render('admin/edit-product', {
        pageTitle : 'Admin',
        path : '/admin/add-product',
        edit:false
    })
}

//store product in database from add-product page no update
//post of add-product page -> 
exports.getProduct = (req, res, next)=>{
    const reqBody = {...req.body, userId: req.user._id}
        productsModel.storeProduct(reqBody).then(() => {
        res.redirect('/admin/products')
    }).catch(err => console.log(err));   
}

//update product in add-product page
//post of edit-product page -> update product button
exports.postEditProduct = (req,res,next) =>{    
    productsModel.storeProduct(req.body).then(() => {
        res.redirect('/admin/products')
    }).catch(err => console.log(err));   
   
    
}

//fetch products from database when click products in admin
//get of /admin/products
exports.getProducts = (req, res, next)=>{
    productsModel.fetchProducts().then(products => {
        res.render('admin/products', {
            pageTitle : 'Admin Products',
            path: '/admin/products',
            products:products
        })
    }).catch(err => console.log(err));
}


// delete product in admin-products page when click delete button and redirect to the same page 
// post of /admin/products
exports.deleteProduct = (req, res, next)=>{
    productsModel.removeProduct(req.body.productId).then (() => {
        usersModel.removeCartItem(req.body.productId, req.user).then(()=>{
            res.redirect('/admin/products');
        })
    }).catch(err => console.log(err));
}

    
//open add porduct page for edit product 
//get of edit product in add-product page -> edit button in admin products page
exports.editProduct = async (req, res, next)=>{   
    productsModel.findProduct(req.params.productId).then(product =>{
      res.render('admin/edit-product', {
          pageTitle : 'Admin',
          path : '/admin/add-product',
          edit:req.query.edit,
          product:product
      })  
    })     
  }


