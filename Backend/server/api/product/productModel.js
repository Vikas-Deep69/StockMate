const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    autoId: { type: Number, default: 0 },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    unit: { type: String, default: "" },
    addedById: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    image: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
});

module.exports = mongoose.model("products", productSchema);
