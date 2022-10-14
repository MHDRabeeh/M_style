require("dotenv").config()
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var ejs = require('ejs');
const flash = require('connect-flash');

const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session")


var expressLayouts = require('express-ejs-layouts');
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
const userModel = require("./models/userModel");
const categoryModel = require('./models/categoryModel')

var app = express();

//mongoose connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then((res) => {
    console.log("mongoose connected successfully");
  })
  .catch((err) => {
    console.log("mongoose not connected");
  });

  
app.set("view engine", "ejs");
app.set("layout","layout/layout")
app.set("layout extractScripts", true)


// view engine setup

app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));

//  app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));






app.use(session({
  secret:"secretkey",
  resave:false,
  saveUninitialized:false
}))

app.use(flash());


app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, no-store');
  next();
});



app.use(passport.initialize())
app.use(passport.session())

passport.use(userModel.createStrategy())
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.use((req,res,next)=>{
  if(req.isAuthenticated()){
    res.locals.user = true
    res.locals.username = req.user.name
    res.locals.userId = req.user.id
  }
  next()
})

app.use("/", indexRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
 });





module.exports = app;
