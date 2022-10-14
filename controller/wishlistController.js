var express = require('express');
const { updateOne } = require('../models/wishlistModel');

 const  wishlistModel = require('../models/wishlistModel');
 module.exports={

    addTowishlist: async (req, res) => {
        const productId = req.params.id
       
        const name = req.name;
        
        
      
        try {
          const userId = req.user.id
      
          let list = await wishlistModel.findOne({ userId :userId });
          if (list) {
          
            let itemIndex = list.myWish.findIndex(p => p.productId == productId);
            if (itemIndex > -1) {
      
         list.myWish.splice(itemIndex,1)
         await list.save()
            } else {
              list.myWish.push({ productId, name });
            }
            await list.save()
            console.log('wishlist pushed');
          } else {
            list = new wishlistModel({
              userId: userId,
              myWish: [{ productId, name  }],
            });
         await list.save()
          console.log('wishlist first added')
      
          }
          // res.send('success')
          res.redirect('back')
        } catch (err) {
          console.log(err);
          res.redirect('/login')
          // res.status(500).send("Something went wrong");
        }
      },
      getWishlist : async (req,res) => {
       try {
        
        const userId = req.user.id
        const findwish = await wishlistModel.findOne({userId:userId}).populate("myWish.productId").exec()
        // console.log(findwish.myWish)
      
        res.render('user/wishlist',{findwish,
            layout:'layout/Cart-layout'
        })
      
       } catch (error) {
        console.log(error);
        res.send(error)
       }
      },
      deleteWishlit:async function(req,res){
        try{
          // console.log("Running deleteWishlist");
          // console.log(req.params.id+"this is params");
          const userId= req.user?.id;
          const productId = req.params.id
    
            await wishlistModel.updateOne({userId:userId},{$pull:{myWish:{productId:productId}}})  
           res.redirect(`/getwishlist/${userId}`);   
    
      } catch(err){
        
        console.log(err)
        res.send(err)
      }
        

      }
      
 }

