
const Product = require('../../models/product');

// const UsersModel = require('../../models/usersModel');
// const usersModel = new UsersModel();
//admin openadd-product page for adding new product
//get of add-product page
exports.addProduct = (req, res, next)=>{    
    res.render('admin/edit-product', {
        pageTitle : 'Admin',
        path : '/admin/add-product',
        edit:false,
        isAuthorized:req.session.isLoggedIn
    })
}

//store product in database from add-product page no update
//post of add-product page -> 
exports.getProduct = (req, res, next)=>{
    const product = new Product({name:req.body.name, image:req.body.image, price:req.body.price, ingredients:req.body.ingredients, userId:req.user});
        product.save().then(() => {
        res.redirect('/admin/products')
    }).catch(err => console.log(err));   
}


//fetch products from database when click products in admin
//get of /admin/products
exports.getProducts = (req, res, next)=>{
    Product.find().then(products => {
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
    Product.findByIdAndRemove(req.body.productId).then (() => {       
            res.redirect('/admin/products');       
    }).catch(err => console.log(err));
}

    
//open add porduct page for edit product 
//get of edit product in add-product page -> edit button in admin products page
exports.editProduct = async (req, res, next)=>{   
    Product.findById(req.params.productId).then(product =>{
      res.render('admin/edit-product', {
          pageTitle : 'Admin',
          path : '/admin/add-product',
          edit:req.query.edit,
          product:product
      })  
    })     
  }


//update product in add-product page
//post of edit-product page -> update product button
exports.postEditProduct = (req,res,next) =>{
    Product.findById(req.body.id).then(product =>{
        product.name = req.body.name;
        product.image = req.body.image;
        product.price = req.body.price;
        product.ingredients = req.body.ingredients;
        product.save().then(() => {
            res.redirect('/admin/products')
        }).catch(err => console.log(err));   
    })
    
}

