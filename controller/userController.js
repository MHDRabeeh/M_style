const userModel = require("../models/userModel");
const productModel = require("../models/ProductModel");
const passport = require("passport");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const {sendOtp,getOtpForm}= require("../middlewares/otp")
module.exports = {
  userRegister: (req, res) => {
    if (req.body.password === req.body.password2) {
      userModel.register(
        {
          name: req.body.name,
          email: req.body.email,
        },
        req.body.password,
        (err, user) => {
          if (err) {
            console.log(err);
            req.flash("message", "User Already registered");
            res.redirect("/signup");
          } else {
            // passport.authenticate("local")(req, res, () => {
            //   res.redirect("/");
            passport.authenticate("local")(req, res, function () {
              process.nextTick(async () => {
                  await sendOtp(req, res)
              })
              res.redirect("/")

            });
          }
        }
      );
    } else {
      console.log("password not match");
      res.redirect("/signup");
    }
  },

  userLogin: passport.authenticate("local", {
    failureRedirect: "/login",
  }),

  userLogout: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },

  checkLogout: (req, res, next) => {
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      next();
    }
  },
  addProfile: async (req, res) => {
    try {
      console.log(req.body);
      const userId = req.user.id;
      const myUser = await userModel.findById(userId);
      myUser.address.unshift({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        mobileNumber: req.body.mobileNumber,
        address: req.body.address,
        postcode: req.body.postcode,
        district: req.body.district,
        areaLocalName: req.body.areaLocalName,
        email: req.body.email,
        country: req.body.country,
        state: req.body.state,
      });
      await myUser.save();
      // console.log("Running");
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  showProfile: async function (req, res) {
    try {
      const userId = req.user.id;
      const myUser = await userModel.findById(userId);
      const showAddress = await myUser.address;
      res.render("user/profile", { showAddress, myUser });
    } catch (err) {
      console.log(err);
    }
  },
  updateAddress: async function (req, res) {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;
      const EditedAddress = await userModel.updateOne(
        { userId, address: { $elemMatch: { _id: addressId } } },
        {
          $set: {
            "address.$.firstName": req.body.firstName,
            "address.$.lastName": req.body.lastName,
            "address.$.mobileNumber": req.body.mobileNumber,
            "address.$.district": req.body.district,
            "address.$.address": req.body.Address,
            "address.$.postcode": req.body.postcode,
            "address.$.areaLocalName": req.body.areaLocalName,
            "address.$.email": req.body.email,
            "address.$.country": req.body.state,
          },
        }
      );
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  },
  showCheckOut: async function (req, res) {
    try {
      const userId = req.user.id;
   
       let couponDiscount =req.session.coupon?.discount;
      // if(couponDiscount  == null)
      // {
      //   couponDiscount =0
      //       }
            console.log(couponDiscount)
      const couponCode = req.session.coupon?.code;
      
      const myUser = await userModel.findById(userId);
      const showAddress = myUser.address;
      const viewcart = await cartModel
        .findOne({ userId: userId })
        .populate("products.productId")
        .exec();
      res.render("user/checkout", {
        showAddress,
        viewcart: viewcart,
        couponDiscount,
        couponCode,
       
      });
    } catch (err) {
      console.log(err);
      res.redirect("login");
    }
  },
  deleteAddress: async function (req, res) {
    try {
      const addressId = req.params.id;
    } catch (err) {
      console.log(err);
    }
  },

  showMyorder: async function (req, res) {
    try {
      userId = req.user.id;

      const myOrders = await orderModel.find({ userId }).populate([
        {
          path: "userId",
          model: "User",
        },
        {
          path: "products.productId",
          model: "Product",
        },
      ]);
      myOrders.reverse()

      res.render("user/myOrders", { myOrders });
    } catch (err) {
      console.log(err);
      res.redirect("login");
    }
  },
  changePassword: (req, res) => {
    const oldPassword = req.body.oldPassword
    const newPassword = req.body.password
    const confirmedPassword = req.body.confirmedPassword
    const user = req.user
    if (newPassword === confirmedPassword) {
        user.changePassword(oldPassword, newPassword, function (err) {
            if (err) {
              console.log("wrong credential")
                res.status(401).json({ message: "wrong credential" })
            }
            else {
              console.log("password is changed")
                res.status(201).json({ message: "password changed" })
            }
        })
    }
    else {
      console.log("password not match")
        res.status(403).json({ message: "password doesn't match" })
    }
 }

};
