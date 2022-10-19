const { isObjectIdOrHexString } = require("mongoose")
const { updateOne } = require("../models/userModel")
const ObjectId = require('mongodb').ObjectId;
const userModel = require('../models/userModel')
const productModel = require('../models/ProductModel')
const categoryModel = require('../models/categoryModel');
const { off } = require("../app");
const orderModel = require('../models/orderModel');

module.exports = {
  adminLogin: (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        res.render('admin/admin-home',{
        layout: 'layout/admin-layout'});
      }
    } catch (error) {
      console.log(error);
      res.render("error")
    }
  },
  adminLogout: (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        console.log('admin logout');
        res.redirect('/')
      }
    } catch (error) {
      res.render('error')
    }
  },
  getUserdata: async (req, res,) => {
    try {
      if (req.user?.isAdmin) {
        const users = await userModel.find({})
        res.render('admin/user-manage',
          {
            users: users,
            layout: 'layout/admin-layout'
          });
      }
    } catch (err) {
      console.log(err)
      res.render('error')
    }
  },
  blockUser: async (req, res) => {
    try {
      await userModel.findByIdAndUpdate(
        req.params.id,
        { isActive: false })
      res.redirect('/admin/getuserdata')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getuserdata')
    }
  },
  activeUser: async (req, res) => {
    try {
      await userModel.findByIdAndUpdate(
        req.params.id,
        { isActive: true })
      res.redirect('/admin/getuserdata')
    } catch {
      console.log(err);
      res.redirect('/admin/getuserdata')
    }
  },

         ///////////////////////////////////////   CATEGORY ///////////////////////////////////////////////



  getCategory: async (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        const categories = await categoryModel.find().sort(
          { categoryName: 1 })
          
        const errorMessage = req.flash("message")
        res.render('admin/category-manage', {
          categories: categories,
          errorMessage: errorMessage,
          layout: 'layout/admin-layout'
        })
      }
    } catch (error) {
      console.log(error);
      res.redirect("/")
    }
  },

  addCategory: async (req, res, next) => {
    try {
      // console.log(req.body)
      // console.log(req.files)
      req.files.forEach(img => {  })
      const productImages = req.files != null ? req.files.map((img) => img.filename) : null
      const category = new categoryModel({
        categoryName: req.body.categoryName,
        image:productImages 
      })
      await category.save()
      res.redirect('/admin/getcategory')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')

    }
  },
  editCategory: async (req, res) => {
    try {
      // console.log(req.params+"((((((((((((((((((((((((((((");
      req.files.forEach(img => {  })
      const productImages = req.files != null ? req.files.map((img) => img.filename) : null
      await categoryModel.findByIdAndUpdate(
        req.params.id,
        { categoryName: req.body.categoryName,image:productImages })
      res.redirect('/admin/getcategory')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await categoryModel.findByIdAndDelete(
        req.params.id).exec()
      req.flash("message", "Category deleted")
      res.redirect('/admin/getcategory')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/getcategory')
    }

  },


                            
     /////////////////////////////////////////////////////  PRODUCT  ///////////////////////////////////////////////////




  getProduct: async (req, res, next) => {
    try {
      if (req.user?.isAdmin) {
        const allCategories = await categoryModel.find()
        const product = await productModel.find().populate("category").exec()
        res.render('admin/product',
          {
            product: product,allCategories:allCategories,

            layout: 'layout/admin-layout'
          })
      }
    } catch (error) {
      console.log(error);
      res.render('error')
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const price = parseFloat(req.body.price)
      const discount = req.body.discount ? parseFloat(req.body.discount) : null
      const offerPrice = req.body.discount ? price - (((price / 100) * discount).toFixed(2)) : null;  
      req.files.forEach(img => {  })
      const productImages = req.files != null ? req.files.map((img) => img.filename) : null
      // console.log(productImages)
      const product = new productModel({
        productName: req.body.productName,
        quantity:req.body.quantity,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        discount: discount,
        offerPrice: offerPrice,
        discription: req.body.discription,
        images:productImages

        // product = await Product.findById(req.params.id)
        // await Product.findByIdAndUpdate(req.params.id, {
      
      })
      await product.save()
      res.redirect('/admin/product')
    } catch (err) {
      console.log(err);
      res.redirect('/admin/product')
    }
  },
  editproduct: async (req, res) => {
    console.log(req.body,"ooooooooooooooooooooooooooooooooooo");
    try {
      await productModel.findByIdAndUpdate(req.params.id, {
        productName: req.body.productName,
        quantity:req.body.quantity,
        category: req.body.category,
        stock: req.body.stock,
        price: req.body.price,
        discription: req.body.discription,
        images: req.body.productImages
      })
      res.redirect('/admin/product')
    } catch (error) {
      console.log(error);
      res.redirect('/admin/product')
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await productModel.findByIdAndDelete(req.params.id)
      res.redirect('/admin/product')
    } catch (error) {
      console.log(error);
      res.redirect('/admin/product')

    }
  },

//////////////////////Orders////////////////////

orders:async function(req,res){
 const allorders= await orderModel.find().populate([
  {
    path:"userId",
    model:"User"
  },
  {
    path:"products.productId",
    model:"Product"
  }
 ])


  res.render("admin/orderManage",{allorders,layout: 'layout/admin-layout'})

},
orderDetials: async function(req,res){
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
      res.render("admin/orderDetails",{myOrder})
    }
  
  }catch(err){
    console.log(err)
    }
}



}



