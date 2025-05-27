const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name:{type:String,default:""},
    image:{type:String,default:""},
    created_at:{type:Date,default:Date.now()},
    status:{type:Boolean,default:true}
})

module.exports= new mongoose.model("categories",categorySchema);

