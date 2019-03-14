const getDB = require('../util/database').getDB;
const mongodb = require('mongodb');
class Users{
    storeUser(user){
        const db = getDB();
        return db.collection('users').insertOne(user);
    }
    findUser(userId){
        const db = getDB();
        return db.collection('users').findOne({_id:new mongodb.ObjectID(userId)}).then(user =>{
            return user;
        }).catch(err => console.log(err));
    }

    addProductToCart(product, user){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(user._id)}).then(user => {
            const Cart = user.cart;
            const UpdateItemIndex = Cart.items.findIndex(item => item._id.toString() === product._id.toString())  
            if(UpdateItemIndex>=0){
                const items = Cart.items.map(item => {
                    if(item._id.toString() === product._id.toString()){
                        item.quantity =  item.quantity + 1;
                        Cart.subTotal = Cart.subTotal + +product.price;
                        return item;
                    }
                    else{
                        return item;
                    }
                })
                Cart.items = items;
            }else{
                Cart.items.push({...product, quantity:1});
                Cart.subTotal = Cart.subTotal + +product.price;
            } 
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}}) 
        }).catch(err => console.log(err));
    }
    fetchCartProduct(user){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(user._id)}).then(user =>{
            return user.cart
        }).catch(err => console.log(err))
    }
    removeCartItem(productId, User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            const removeItem = Cart.items.findIndex(item => item._id.toString() === productId.toString())
            Cart.subTotal = Cart.subTotal - (+Cart.items[removeItem].price *Cart.items[removeItem].quantity)
            Cart.items = Cart.items.filter(item => item._id.toString() !== productId.toString())
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    DecreaseItem(productId, User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            Cart.items = Cart.items.map(item => {
                if(item._id.toString() === productId.toString()){
                    if(item.quantity>1){                        
                        item.quantity -= 1;
                        Cart.subTotal = Cart.subTotal - +item.price;
                        return item; 
                    }                    
                }
                else{
                    return item;
                }
            })
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    IncreaseItem(productId, User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            Cart.items = Cart.items.map(item => {
                if(item._id.toString() === productId.toString()){                                 
                        item.quantity += 1;
                        Cart.subTotal = Cart.subTotal + +item.price;
                        return item;                    
                }
                else{
                    return item;
                }
            })
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    moveItemToCart(productId,User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            const removeItem = Cart.saveForLater.findIndex(item => item._id.toString() === productId.toString())
            Cart.subTotal = Cart.subTotal + (+Cart.saveForLater[removeItem].price *Cart.saveForLater[removeItem].quantity);
            let checkItemInCart = 0;
            Cart.items = Cart.items.map(item=>{
                if(item._id.toString() === productId.toString()){
                    item.quantity = item.quantity + Cart.saveForLater[removeItem].quantity;
                    checkItemInCart++;
                    return item;

                }else{
                    return item;
                }
            })
            if(checkItemInCart === 0){
                Cart.items.push(Cart.saveForLater[removeItem])
            }
            Cart.saveForLater = Cart.saveForLater.filter(item => item._id.toString() !== productId.toString())
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    deleteSaveItem(productId,User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            Cart.saveForLater = Cart.saveForLater.filter(item => item._id.toString() !== productId.toString())
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    saveLaterItem(productId,User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const Cart = user.cart;
            const removeItem = Cart.items.findIndex(item => item._id.toString() === productId.toString())
            Cart.subTotal = Cart.subTotal - (+Cart.items[removeItem].price *Cart.items[removeItem].quantity)
            Cart.saveForLater.push(Cart.items[removeItem])
            Cart.items = Cart.items.filter(item => item._id.toString() !== productId.toString())
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:Cart}})
        }).catch(err => console.log(err))
    }
    orderItems(User){
        const db =getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectID(User._id)}).then(user => {
            const orderItems = user.cart.items;
            user.cart.items = [];
            user.cart.subTotal = 0;
            const order = {
                userId: new mongodb.ObjectID(User._id),
                name:user.name,
                email:user.email,
                orderItems:orderItems
             }
            return db.collection('users').updateOne({_id: new mongodb.ObjectID(user._id)}, {$set:{cart:user.cart}}).then(()=>{
                return db.collection('orders').insertOne(order);
            })
        }).catch(err => console.log(err))
    }
    fetchOrders(User){
        const db =getDB();
        return db.collection('orders').find({userId: new mongodb.ObjectID(User._id)}).toArray().then(orders => {
          return orders
                
        })
    }

}
module.exports = Users;