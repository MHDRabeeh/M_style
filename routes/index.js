var express = require("express");
const { render } = require("../app");
const cartController = require("../controller/cartController");
const productController = require("../controller/productController");
var router = express.Router();
const userController = require("../controller/userController");
const wishlistController = require("../controller/wishlistController");
const ProductModel = require("../models/ProductModel");
const { route } = require("./admin");
const orderController = require("../controller/orderController");
// const cartContrcoller = require('../controller/cartController')
const couponController = require("../controller/couponController");
const bannerController = require("../controller/bannerController");
const adminController = require("../controller/adminController");
const paymentController = require("../controller/paymentController");
const {
  otpVerification,
  getOtpForm,
  sendOtp
} = require("../middlewares/otp");

/* GET home page. */
router.get("/", productController.showProduct);

router.get("/login", userController.checkLogout, function (req, res, next) {
  res.render("user/user-login");
});

router.get("/signup", userController.checkLogout, function (req, res, next) {
  const errorMessage = req.flash("message");
  res.render("user/user-signup", {
    errorMessage: errorMessage,
    layout: "layout/layout",
  });
});

router.post("/signup", userController.userRegister);

router.post("/login", userController.userLogin, (req, res) => {
  if (req.user.isAdmin) {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
}),
  router.post("/logout", userController.userLogout);
router.get("/product", (req, res) => {
  res.render("user/product");
});
/////////////////////////// OTP//////////////

router.post("/validateOtp", otpVerification)

router.post("/resendOtp", async (req, res) => {
  getOtpForm(req, res)
  await sendOtp(req, res)
  req.flash("message", "Otp resend successful")
})





//////////////////////////////////////////////
router.get("/show-category-product/:id", productController.categoryWiseList);

router.get("/viewProduct/:id", productController.viewProduct);

router.post("/addtocart/:id", cartController.addTocart);
router.get("/getcart", cartController.getcart);
router.get("/cartItemCount", cartController.cartItemCount);
router.delete("/deleteCartItem/:id", cartController.deleteItem);

router.get("/checkout", userController.showCheckOut);
router.get("/addtowishlist/:id", wishlistController.addTowishlist);
router.get("/getwishlist/:id", wishlistController.getWishlist);
router.post("/delete-wishlist/:id", wishlistController.deleteWishlit);

/////////////////////////////PROFILE/////////////////////

router.get("/profile", userController.showProfile);
router.post("/add-profile", userController.addProfile);
router.post("/EditAddress/:id", userController.updateAddress);
router.get("/deleteAddress/:id", userController.deleteAddress);

///////////////////////////payment///////////////////////

router.post("/payment", orderController.paymentMethod);
router.get("/orders/:id", orderController.orderdeiteils);


///////////////////////// coupon/////////////////

router.post("/redeem/:id", couponController.redeemCoupon);
router.get("/myOrders", userController.showMyorder);

/////////////////////payment////////////////////////
router.post("/payment/orderId", paymentController.generateOrder);
router.post("/payment/verify/:orderId", paymentController.verifyPayment);
/////////////////// change password//////////
router.put("/changePassword", userController.changePassword)

/////////////////////// orderDetails/////////

router.get('/myOrders/:id',productController.orderdeitails)
module.exports = router;
