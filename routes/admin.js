var express = require('express');
const { response } = require('../app');
var router = express.Router();
const multer = require('multer');
const adminController = require("../controller/adminController");
const middlewares = require('../middlewares/multer');

const categoryModel = require('../models/categoryModel');
const ProductModel = require('../models/ProductModel');
const userModel = require('../models/userModel');
const userController = require('../controller/userController');
const { getCategory } = require('../controller/adminController');
const { route } = require('.');
const bannerController = require('../controller/bannerController');
const couponController = require('../controller/couponController');
const orderController = require('../controller/orderController');
const productController = require('../controller/productController');
const paymentController = require('../controller/paymentController');


/* GET users listing. */


router.get('/', adminController.adminLogin);
router.get('/', adminController.adminLogout);


                // ADD NEW USER  ,  BLOCK   AND CHANGE STATUS
router.get('/getuserdata', adminController.getUserdata)
router.post("/blockuser/:id", adminController.blockUser)
router.post('/activeUser/:id', adminController.activeUser)


                    // CATEGORY
router.get('/getcategory', adminController.getCategory,)
router.post('/addCategory', middlewares.upload, adminController.addCategory)
router.post('/editCategory/:id',middlewares.upload,adminController.editCategory)
router.post('/deletecategory/:id', adminController.deleteCategory)

                    //PRODUCT



router.get('/product', adminController.getProduct)
router.post('/addproduct', middlewares.send, adminController.addProduct)
router.post('/editproduct/:id', adminController.editproduct)
router.post('/deleteproduct/:id', adminController.deleteProduct)


router.get('/banner-management',bannerController.showBanner);
router.post('/Addbannerimage',middlewares.send,bannerController.addBanner)

                //  COUPON//
router.get('/coupon-management',couponController.showCoupon)
router.post('/Add-Coupon',couponController.AddCoupon);
router.post('/coupon-active/:id',couponController.couponActive)
router.post('/coupon-deactive/:id',couponController.couponDeactive)




 router.get('/order-management',adminController.orders)
 router.post('/packOrder/:id',orderController.packOrder)
 router.post('/shipOrder/:id',orderController.shipeOrder)
 router.post('/outForDelivery/:id',orderController.outForDelivery)
 router.post('/deliverPackage/:id',orderController.deliveryPackage)
 router.post('/cancelOrder/:id',orderController.cancelOrder)


 router.get('/dashboard',productController.showDashboard)

 router.get("/orders/:id",adminController.orderDetials)
 router.get('/d',function(req,res){
  // res.send("thej")
 res.render('admin/salesreport')
 })


  //////////payment///////
  // router.post('/onlinePayment',paymentController.onlinePayment)

 


module.exports = router;
