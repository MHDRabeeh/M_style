const mongoose = require('mongoose');
const { find } = require('../models/bannerModel');
const bannerModel = require('../models/bannerModel');
module.exports = {
    addBanner:async function(req,res){
        try{
           
            req.files.forEach(img => {  })
            const bannerImages = req.files != null ? req.files.map((img) => img.filename) : null
            const addBanner = new bannerModel({
                image:bannerImages,
                discription:req.body.discription
            })
            await addBanner.save();
            res.redirect('banner-management')
        
         
        }catch(err){
            console.log(err);
        }
    },
    showBanner:async function(req,res){
        try{
            if(req.user.isAdmin){
       const showBanner = await bannerModel.find();
       
       res.render('admin/banner',{showBanner, layout: 'layout/admin-layout'})
    }
        }catch(err){

        }
    }
}