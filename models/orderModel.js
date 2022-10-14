const mongoose = require('mongoose');
const  orderSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    deliveryAddress:{
        type:Object
    },
    products:[
        {
            productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"'Product",
            },
            quantity:Number,
            name:String,
            price:Number,
            offerPrice:Number
        }
    ],
    coupon:{
        code:String,
        discount:Number
    },
    quantity :Number,
    total:Number,
    subtotal:Number,
    status:{
        type:String,
        default:"Pending"
    },
    paymentType:String

},{timestamps:true})
module.exports = mongoose.model('Order', orderSchema)