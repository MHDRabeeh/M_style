const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
module.exports = {
  paymentMethod: async function (req, res) {
    try {
      const userId = req.user.id;
      const paymentType = req.body.billtype;
      const addressId = req.body.address;
     const couponDiscount = req.session.coupon?.discount
     const  couponCode = req.session.coupon?.code
     const couponId = req.session.coupon?.id
     const user = await userModel.findById(userId);
      const cart = await cartModel.findOne({ userId });
      const orderedAddress = await userModel.findById(userId, {
        address: { $elemMatch: { _id: addressId } },
      });

      

      const newOrder = new orderModel({
        userId: userId,
        deliveryAddress: orderedAddress.address[0],
        products: cart.products,
        quantity: cart.quantity,
        subtotal: cart.subtotal,
        total: cart.total,
        paymentType: paymentType,
      });

      

        // adding coupon details if applied 
      if(req.session.coupon){
        console.log(req.session.coupon);
        newOrder.total = cart.total - couponDiscount
        newOrder.coupon.code = req.session.coupon.code
        newOrder.coupon.discount= couponDiscount
        // adding coupon to user coupon list
        user.redeemedCoupons.push(couponId)
        await user.save()
      }
     
      // if (paymentType === "COD") {
      //   console.log("Running");
        
       
        
      //   // res.json(orders);
       
      //   return res.status(200).json({message:"Running"});
       
      //   //    res.redirect('/orders')
      // }else{

      // }
      await newOrder.save()
      await cart.remove()
      return res.status(200).json({message:"Running"});
     
     
    
    } catch (err) {
      console.log(err);
      res.sendStatus(500)
    }
  },
  orderdeiteils: async function (req, res) {
    res.send(req.params.id);
  },
  packOrder:async function(req,res){
    try{
      const orderId=req.params.id
      const orders= await orderModel.findById( orderId)
     
      if(orders.status!="Cancelled"){
        console.log(orders.status)
       orders.status = "Packed"
       await orders.save();
       return res.status(201).json({message:"order Packed"})
      }else{
        return res.status(400).json({message:"Can't update status , item Cancelled"})
      }

    }catch(err){
      console.log(err);
      return res.status(500).json(err)
    }
  },
  shipeOrder:async function(req,res){
    try{
      const orderId = req.params.id
      const orders=await orderModel.findById(orderId);
      if(orders.status!="Cancelled"){
        orders.status= "Shipped"
        await orders.save()
        return res.status(201).json({message:"order shipped"})
        
      }else{
        return res.status(400).json({message:"Can't update status , item Cancelled"})
      }
    }catch(err){
      console.log(err);
    }
  },
  outForDelivery:async function(req,res){
    try{
      const orderId = req.params.id
      const orders= await orderModel.findById(orderId)
      if(orders.status!="Cancelled"){
        orders.status = "Out For Delivery"
        await orders.save()
        return res.status(201).json({message:"order out for delivery"})
      }else{
        return res.status(400).json({message:"Can't update status , item Cancelled"})
      }
    }catch(err){
      console.log(err)
    }

  },
  deliveryPackage:async function(req,res){
    try{
      const orderId = req.params.id
      const orders = await orderModel.findById(orderId)
      if(orders.status!="Cancelled"){
        orders.status = "Delivered"
        await orders.save()
        return res.status(201).json({message:"Order Delivered"})
      }else{
        return res.status(400).json({message:"Can't update status , item Cancelled"})
      }
    }catch(err){
        console.log(err);
    }
  },
  cancelOrder:async function(req,res){
    try{
      orderId = req.params.id
    
      const orders = await orderModel.findById(orderId)
      if(orders.status != "Delivered"){

    
      orders.status = "Cancelled"
      orders.save()
      return res.status(201).json({message:"order cancelled"})
    }else{
      return res.status(400).json({message:"order is alredy delivered"});
    }
    }catch(err){
      console.log(err);
    }
  }


};
