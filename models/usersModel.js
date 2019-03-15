const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[{
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            name: {
                type: String,
                required:true
            },
            image: {
                type:String,
                required:true
            },
            price:{
                type:Number,
                required: true
            }
        }],
        subTotal:{
            type:Number,
            required:true
        },
        saveForLater:[{
            productId:{
                type:Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            name: {
                type: String,
                required:true
            },
            image: {
                type:String,
                required:true
            },
            price:{
                type:Number,
                required: true
            }
        }],

    },
    orders:[{
        quantity:{
            type:Number,
            required:true
        },
        name: {
            type: String,
            required:true
        },
    }]
    
})

UserSchema.methods.addToCart = function(product) {
    const cart = this.cart;
    const UpdateItemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString())
    if(UpdateItemIndex>=0){
        cart.items[UpdateItemIndex].quantity += 1;
        cart.subTotal = cart.subTotal +  cart.items[UpdateItemIndex].price;
    }else{
        cart.items.push({name:product.name, image:product.image, price:product.price, productId:product._id, quantity:1});
        cart.subTotal = cart.subTotal + product.price;
    }
    this.cart = cart;
    this.save();       
}

UserSchema.methods.decItem = function(productId) {
    const cart = this.cart;
    const UpdateItemIndex = cart.items.findIndex(item => item._id.toString() === productId.toString())
    if(cart.items[UpdateItemIndex].quantity>1){
        cart.items[UpdateItemIndex].quantity -= 1;
        cart.subTotal = cart.subTotal -  cart.items[UpdateItemIndex].price;
    }
    this.cart = cart;
    return this.save();       
}

UserSchema.methods.incItem = function(productId) {
    const cart = this.cart;
    const UpdateItemIndex = cart.items.findIndex(item => item._id.toString() === productId.toString())
    cart.items[UpdateItemIndex].quantity += 1;
    cart.subTotal = cart.subTotal + cart.items[UpdateItemIndex].price;
    this.cart = cart;
    return this.save();        
}
UserSchema.methods.deleteCartItem = function(productId) {
    const cart = this.cart;
    const UpdateItemIndex = cart.items.findIndex(item => item._id.toString() === productId.toString())
    cart.subTotal = cart.subTotal - (cart.items[UpdateItemIndex].price*cart.items[UpdateItemIndex].quantity);
    cart.items = cart.items.filter(item => item._id.toString() !== productId.toString())
    this.cart = cart;
    return this.save();        
}
UserSchema.methods.moveToCartItem = function(productId) {
    const cart = this.cart;
    const UpdateItemIndex = cart.saveForLater.findIndex(item => item._id.toString() === productId.toString())
    const checkinCart = cart.items.findIndex(item => item._id.toString() === productId.toString())
    if(checkinCart>=0){
        cart.items[checkinCart].quantity += cart.subTotal[UpdateItemIndex].quantity;
    }
    else{
        cart.items.push(cart.saveForLater[UpdateItemIndex])
    }
    cart.subTotal = cart.subTotal + (cart.saveForLater[UpdateItemIndex].price*cart.saveForLater[UpdateItemIndex].quantity);
    cart.saveForLater = cart.saveForLater.filter(item => item._id.toString() !== productId.toString())
    this.cart = cart;
    return this.save();        
}
UserSchema.methods.saveLaterItem = function(productId) {
    const cart = this.cart;
    const UpdateItemIndex = cart.items.findIndex(item => item._id.toString() === productId.toString())
    cart.subTotal = cart.subTotal - (cart.items[UpdateItemIndex].price*cart.items[UpdateItemIndex].quantity);
    cart.saveForLater.push(cart.items[UpdateItemIndex]);
    cart.items = cart.items.filter(item => item._id.toString() !== productId.toString())
    this.cart = cart;
    return this.save();        
}
UserSchema.methods.deleteSaveLaterItem = function(productId) {
    const cart = this.cart;    
    cart.saveForLater = cart.saveForLater.filter(item => item._id.toString() !== productId.toString())
    this.cart = cart;
    return this.save();        
}
UserSchema.methods.fetchOrders = function() {
    console.log('order-----------------------',this.cart)
    return this.orders;
}
UserSchema.methods.orderItems = function() {
    const cart = this.cart;
    this.orders = this.cart.items;
    cart.items = [];
    cart.subTotal = 0;
    this.cart = cart;
    return this.save();
}
module.exports = mongoose.model('User', UserSchema);