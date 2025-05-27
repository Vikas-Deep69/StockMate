const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: "" },
    email: { type: String },
    password: { type: String },
    userType: { type: Number },// 1-admin,2-whole,3-shopkeeper
    created_at: { type: Date, default: Date.now() },
    status: { type: Boolean, default: true }
})

module.exports = new mongoose.model("users", userSchema);

