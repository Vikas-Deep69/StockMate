const mongoose = require("mongoose");

const wholesalerSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    contact: { type: String, default: "" },
    address: { type: String, default: "" },
    profile: { type: String, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    created_at: { type: Date, default: Date.now() },
    request: { type: String, default: "pending" },  //pending,approve,reject
    status: { type: Boolean, default: true }
})

module.exports = new mongoose.model("wholesalers", wholesalerSchema);

