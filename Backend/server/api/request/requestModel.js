const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    shopkeeperId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            quantity: { type: Number },
        }
    ],
    totalAmount: { type: Number, default: 0 },
    wholesalerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    paymentType: { type: String, default: "pending" },
    paymentStatus: { type: String, default: "pending" },
    meetingLink: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() },
    status: { type: String, default: "pending" }
})

module.exports = new mongoose.model("request", requestSchema);

