const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    Name: {
         type: String, 
         required: true 
        },
    ShopName:{
        type: String,
        required:true
    },
    Mobile:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    }
}, { timestamps: true });

const modelName = mongoose.model('Shop', ShopSchema);

module.exports = modelName;
