const couponModel = require("../models/couponModel");
const Cart = require("../models/cartModel");
const userModel = require("../models/userModel");

module.exports = {
    AddCoupon:async function(req,res){
        console.log(req.body);
        try{
            const addCoupon = new couponModel({
                name:req.body.name,
                couponCode: req.body.coupon,
                discount:req.body.discount,
                maxLimit:req.body.maxLimit,
                minPurchase:req.body.minPurchase,
                expDate:req.body.expDate,
                maxLimit:req.body.maxLimit
            })
            addCoupon.save()
            res.redirect('/admin/coupon-management');
        }
        catch(err){
            console.log(err);
            res.redirect('/admin/coupon-management');
            
        }
       
    },
    showCoupon:async function(req,res){
        try{
        if(req.user.isAdmin===true){ 
            const showCoupons =await couponModel.find()
            console.log(showCoupons);
            res.render('admin/coupon-management',{showCoupons})
        }
        else{
            res.render('user/user-login')
        }
        }catch(err){
            console.log(err)
        }
    },
    redeemCoupon:async function(req,res){
        console.log(req.body)
        const userId = req.user?.id
        const couponCode = req.params.id
       
        try{
            const findCart = await Cart.findOne({userId});
            const findCoupon = await couponModel.findOne({couponCode});
           
            const user = await userModel.findById(userId);
            const totalPrice = findCart.total
            const expDate = findCoupon?.expDate

            const isNotExpired = expDate ? new Date() <= expDate:true
            if(findCoupon?.isActive && isNotExpired){
                const isRadeemed = user.redeemedCoupons.includes(findCoupon.id)
                if(!isRadeemed){
                    if(totalPrice>=findCoupon.minPurchase){
                        const discount = ((totalPrice*findCoupon.discount)/100)
                        const couponDiscount = discount<=findCoupon.maxLimit ? Number(discount):Number(findCoupon.maxLimit)
                        // saving coupon details to session
                        req.session.coupon = {
                            id:findCoupon.id,
                            code:findCoupon.couponCode,
                            discount:couponDiscount
                        }
                        console.log("running");
                        // console.log(req.session.coupon);
                        return res.status(200).json({couponDiscount,totalPrice,message :"valid coupon"})
                    }else{
                        req.session.coupon = null
                        console.log("minimum purchase is"+ findCoupon.minPurchase)
                        return res.status(400).json({message:`minimum purchase is ${findCoupon.minPurchase}`,minPurchase:findCoupon.minPurchase})
                        
                    }
                     
                }else{
                    req.session.coupon = null
                    console.log("coupon already radeemed");
                    return res.status(403).json({message:"coupon already redeemed"})
                }
            }else{
                console.log('coupon is not valid or expired');
                req.session.coupon=null
                return res.status(404).json({message:"coupon is not valid or expired"})
            }
            

        }catch(err){
                console.log(err);
        }
    }
    ,
    couponDeactive:async function(req,res,next){
        couponId = req.params.id
        try{
           await couponModel.findByIdAndUpdate(couponId,{isActive:false})
           res.redirect('/admin/coupon-management');
           
        }catch(err){
            console.log(err)

        }

    },
    couponActive:async function(req,res,next){
        couponId = req.params.id
       
       
        try{
            await couponModel.findByIdAndUpdate(couponId,{isActive:true})
            res.redirect('/admin/coupon-management');

        }catch(err){
            console.log(err)
        }

    }
}