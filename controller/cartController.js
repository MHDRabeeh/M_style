const productModel = require('../models/ProductModel');
const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const ProductModel = require('../models/ProductModel');
const categoryModel = require('../models/categoryModel')
const wishlistModel = require('../models/wishlistModel')
var mongoose = require('mongoose');
const { find } = require('../models/userModel');


module.exports={

    
  addTocart: async (req, res) => {
    console.log(req.session)
    const productId = req.params.id
    const price = Number(req.body.price);
    const quantity = (req.body.quantity)
    const {name,offerPrice} = req.body;
    try {
      console.log(productId);

      const findProduct = await productModel.findById(productId)
      
      if(findProduct.stock >= quantity){
        findProduct.stock -= quantity
      
      const userId = req.user.id
      let cart = await cartModel.findOne({ userId });
      if (cart) {

        
        //cart exists for user
        let itemIndex = cart.products.findIndex(p => p.productId == productId);
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity += quantity;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({ productId, price, quantity, name ,offerPrice });
        }



        cart.subTotal = cart.products.reduce((acc,curr) => {
          return acc +curr.quantity * curr.price;
        },0)
        cart.total = cart.products.reduce((acc,curr) => {
          return acc + curr.quantity * (curr.offerPrice || curr.price);
        },0) 
        await cart.save()



      } else {

        //no cart for user, create new cart
        const subTotal = quantity * price
        const total = offerPrice ? quantity * offerPrice : subTotal
        cart = new cartModel({
          userId: userId,
          products: [{ productId, quantity, price, name ,offerPrice }],
          subTotal:subTotal,
          total:total

        });

        await cart.save()
    
      }
      res.status(201).json({message:"cart item updated"})
  
    }else{
      return res.status(200).json({message:"item not available"})
    }
    
    } catch (err) {
      console.log(err);
 
      res.status(500).send({err});
    }

},


getcart: async (req,res) => {
  try {
    const userId = req.user.id

let viewcart  = await cartModel.findOne({ userId:userId }).populate("products.productId").exec()

  

    res.render('user/Cart',{viewcart,
      layout:'layout/Cart-layout'
    })

  } catch (error) {
    console.log(error);
    res.redirect('/')
  }
},

cartItemCount:async (req,res,next) => {
  
  try {
    const userId = req.user?.id
    let itemCount = 0 
    const cart = await cartModel.findOne({userId})
    if (cart){
      cart.products.forEach(productModel => {
        itemCount += productModel.quantity
      })
    }
    res.locals.cartItemCount = itemCount
    return res.status(200).json({itemCount:itemCount})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error})
  }
},

deleteItem: async (req, res, next) => {
    const userId = req.user.id
    const productId = req.params.id
    const cartCount = req.body.cartCount
    try {
        const findProduct = await ProductModel.findById(productId)
        findProduct.quantity += cartCount
        const cart = await cartModel.findOne({ userId })
        const itemIndex = cart.products.findIndex(product => product.productId == productId);
        cart.products.splice(itemIndex, 1)
        cart.subTotal = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
        }, 0)
        cart.total = cart.products.reduce((acc, curr) => {
            return acc + curr.quantity * (curr.offerPrice || curr.price);
        }, 0)
        await cart.save()
        await findProduct.save()
        return res.status(200).json({
            message: "successfully deleted",
            cartSubTotal: (cart.subTotal).toFixed(2),
            cartDiscount: (cart.subTotal - cart.total).toFixed(2),
            cartTotal: (cart.total).toFixed(2)
        })
    } catch (err) {
        return res.status(400).json({ err })
    }
  },
}