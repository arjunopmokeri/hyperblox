var mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    productname:{
        type:String,
        required:true,
        maxlength:100
    },
    productcode:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
        maxlength:100
    }
});
module.exports = mongoose.model('Product', ProductSchema);