const productModel = require('../models/ProductModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const ProductModel = require('../models/ProductModel');
const categoryModel = require('../models/categoryModel')
const wishlistModel = require('../models/wishlistModel')
var mongoose = require('mongoose');
const { find } = require('../models/userModel');
const orderModel = require('../models/orderModel');


module.exports = {
  showProduct: async (req, res) => {
 
    try {
     const allCategory= await categoryModel.find()
     const Allproduct = await productModel.find()
      .limit(12).exec();
      res.render('home', { Allproduct: Allproduct,allCategory:allCategory});
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  },
  viewProduct: async (req, res) => {
  
    try {
     const relateProduct = await productModel.find().limit(4)
     const singleProduct = await productModel.findById(req.params.id)
      res.render('user/view-product', { singleProduct: singleProduct, relateProduct: relateProduct })
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
  },

categoryWiseList:async function(req,res){
 const categoryWiseProduct =await productModel.find({category:req.params.id});
 console.log(categoryWiseProduct)
 res.render('user/shop',{categoryWiseProduct});
}
,
showDashboard:async function(req,res){
  const user = await userModel.find()
  const userCount = user.length
   
  const orders = await orderModel.find();
  const totalSales= await orders.reduce((value, curr)=>{
    return value =value+ curr.total
  },0)

  const totalOrder = await orderModel.find().countDocuments()
  const pendingOrder = await orderModel.find({status:"Pending"}).countDocuments()
  const CompletedOrder = await orderModel.find({status:"Delivered"}).countDocuments()
  const cancelledOrder = await orderModel.find({status:"Cancelled"}).countDocuments()
  const shippedOrder = await orderModel.find({status:"Shipped"}).countDocuments()
  const dallyTotal = await orderModel.aggregate([

    // First Stage
    {
        $match: { "createdAt": { $ne: null } }
    },
    {
        $match: { "status": { $ne: "Cancelled" } }
    },
    // Second Stage
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$total" },
        }
    },
    // Third Stage
    {
        $sort: { _id: -1 }
    }
])

  const orderStatus = [userCount,totalSales,totalOrder,pendingOrder,CompletedOrder,cancelledOrder ,shippedOrder]
  
  res.render('admin/dashboard',{orderStatus:orderStatus, dallyTotal: dallyTotal})

 

},
orderdeitails:async function (req,res){
  try{

  
  const orderId = req.params.id
  const userId = req.user?.id
  const myOrder = await orderModel.findById(orderId).populate([
    {
      path:"userId",
      model:"User"
    },
    {
      path:"coupon",
      model:"Coupon"
    },
    {
      path:"products.productId",
      model:"Product"
    }
  ])
  .exec();
  
  if(myOrder&& myOrder.userId.id== userId){
    res.render("user/orderDetails",{myOrder})
  }

}catch(err){
  console.log(err)
  }

 
},

  allProduct:async function(req,res){
   try{
    console.log("working all product show")
     const allProduct = await productModel.find();
    //  res.send(allProduct)
     res.render('user/shopeAll',{allProduct})
   }catch(err){
    console.log(err);
   }
}

}
