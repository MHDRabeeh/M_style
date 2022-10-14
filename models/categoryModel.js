const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true

},
 image:{
    type:Array
 }

})

module.exports = mongoose.model("Category", categorySchema);