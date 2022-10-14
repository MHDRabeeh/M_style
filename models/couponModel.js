const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    couponCode:{
        type:String,
        require:true
    },
    isActive:{
        type:Boolean,
        require:true
    },
    discount:{
        type:Number,
        require:true
    },
    maxLimit:{
        type:Number,
        require:true
    },
    minPurchase:{
        type:Number,
        require:true
    },
    expDate:{
        type:Date,
        require:true
    },
},{timeseries:true})

module.exports = mongoose.model('Coupon',couponSchema)