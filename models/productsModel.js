
const uniqid = require('uniqid');
const getDB = require('../util/database').getDB;
const mongodb = require('mongodb');

// const CartModel = require('../models/cartModel');
// const cartModel = new CartModel(configs.data.cart); 


class Products{
    storeProduct(product){
        const db = getDB();
        if(product.id){
            return db.collection('products').updateOne({_id: new mongodb.ObjectID(product.id)}, {$set:{name:product.name, image:product.image, price:product.price, ingredients:product.ingredients}}); 
        }
        else{
            return db.collection('products').insertOne(product);
        }
        
    }

    fetchProducts(){
        const db = getDB();
        return db.collection('products').find().toArray().then(products => {
            return products;
        }).catch(err =>{
            console.log(err)
        });
    }  

    fetchProduct(productId){
        const db = getDB();
        return db.collection('products').find({_id: new mongodb.ObjectID(productId)}).next().then(product => {
            return product;
        }).catch(err =>{
            console.log(err)
        });
    }

    removeProduct(productId){
        console.log(productId)
        const db = getDB();
        return db.collection('products').remove({_id: new mongodb.ObjectID(productId)}).then(product => {
            return product;
        }).catch(err =>{
            console.log(err)
        });
    }
    
    findProduct (productId){
        const db = getDB();
        return db.collection('products').find({_id: new mongodb.ObjectID(productId)}).next().then(product => {
            return product;
        }).catch(err =>{
            console.log(err)
        });
    }
}

module.exports = Products;