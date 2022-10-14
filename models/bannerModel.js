const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
  image:Array,
  discription:String

})

module.exports = mongoose.model('banner',bannerSchema);