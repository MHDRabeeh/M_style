const { query } = require("express");
const mongoose = require("mongoose");
const passportLocalMongoos = require("passport-local-mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema({

 firstName:{
  type:String
 
 },
 lastName:{
  type:String
 },
 mobileNumber:{
  type:Number
 
 },
 address:{
  type:String
  
 },
 postcode:{
  type:Number

 },
 district:{
  type:String
 
 },
 areaLocalName:{
  type:String
  
 },
 village:{
   type:String
 },
 email:{
  type:String
 
 },
 country:{
  type:String
  
 },
 state:{
  type:String

 }

})

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type:Boolean,
    required:true,
     default:false
    },
  isActive:{
    type:Boolean,
    required:true,
    default:true
  },
  address:{
    type:[addressSchema]
  },
  redeemedCoupons:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Coupon"
  }]
  ,
 otp:{
  type:Number
 },
 isVerified: {
  type: Boolean,
  required: true,
  default: false
},
});

//password hash and salt 
UserSchema.plugin(passportLocalMongoos, {
  usernameField: "email",
  findByUsername:function (model,queryParameters){
    queryParameters.isActive = true;
    return model.findOne(queryParameters);
  }
});

module.exports = mongoose.model("User", UserSchema);
