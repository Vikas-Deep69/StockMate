const Category = require("../category/categoryModel");
const Product = require("../product/productModel");
const Request = require("../request/requestModel");
const Shopkeeper = require("../shopkeeper/shopkeeperModel");
const User = require("../user/userModel");
const Wholesaler = require("../wholesaler/wholesalerModel");

const adminDashboard = async (req, res) => {
    try {
        const totalCategories = await Category.countDocuments({ status: true });
        const totalProducts = await Product.countDocuments({ status: true });
        const allRequests = await Request.countDocuments();
        const pendingRequests = await Request.countDocuments({ status: "pending" });
        const paidRequests = await Request.countDocuments({ paymentStatus: "paid" });
        const pendingPayments = await Request.countDocuments({ paymentStatus: "pending" });
        const totalShopkeepers = await Shopkeeper.countDocuments({ status: true });
        const totalWholesalers = await Wholesaler.countDocuments({ status: true });
        const shopkeeperPendingRequests = await Request.countDocuments({
            request: "pending",
        });
        const wholesalerPendingRequests = await Request.countDocuments({
            request: "pending",
        });
        res.status(200).json({
            success: true,
            message: "Admin dashboard data loaded successfully",
            data: {
                totalCategories,
                totalProducts,
                allRequests,
                pendingRequests,
                paidRequests,
                pendingPayments,
                totalShopkeepers,
                shopkeeperPendingRequests,

                totalWholesalers,
                wholesalerPendingRequests
            }
        });
    } catch (err) {
        console.error("Admin Dashboard Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};






const sales = async (req, res) => {
    try {
        if (!req.body.startDate || !req.body.endDate) {
            return res.json({
                success: false,
                status: 400,
                message: "startDate and endDate are required"
            });
        }
        let filter = {};

        if (req.body.startDate || req.body.endDate) {
            filter.createdAt = {};
            if (req.body.startDate) {
                const start = new Date(req.body.startDate);
                start.setHours(0, 0, 0, 0);
                filter.createdAt.$gte = start;
            }
            if (req.body.endDate) {
                const end = new Date(req.body.endDate);
                end.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = end;
            }
        }


        if (req.body.paymentStatus) {
            filter.paymentStatus = req.body.paymentStatus;
        }

        if (req.body.shopkeeperId) {
            filter.shopkeeperId = req.body.shopkeeperId;
        }

        if (req.body.wholesalerId) {
            filter.wholesalerId = req.body.wholesalerId;
        }

        const Requests = await Request.find(filter).populate("shopkeeperId").populate("wholesalerId").populate("products.productId");
        const total = await Request.countDocuments(filter);

        const totalAmount = Requests.reduce((sum, req) => {
            return sum + (req.totalAmount || 0);
        }, 0);

        return res.json({
            success: true,
            status: 200,
            message: "Requests loaded successfully",
            total: total,
            totalAmount: totalAmount,
            data: Requests
        });

    } catch (err) {
        console.error("Error loading Requests:", err);
        return res.json({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err.message
        });
    }
};





const wholeSalerDashboard = async (req, res) => {
    try {
        if (req.decoded.addedById) {
            const totalProducts = await Product.countDocuments({ status: true, addedById: req.decoded.addedById });
            const pendingRequests = await Request.countDocuments({ status: "pending", wholesalerId: req.decoded.addedById });
            const paidRequests = await Request.countDocuments({ paymentStatus: "paid", wholesalerId: req.decoded.addedById });
            const pendingPayments = await Request.countDocuments({ paymentStatus: "pending", wholesalerId: req.decoded.addedById });
            res.status(200).json({
                success: true,
                message: "Whole Saler dashboard data loaded successfully",
                data: {
                    totalProducts,
                    pendingRequests,
                    paidRequests,
                    pendingPayments,
                }
            })
        }
        else {
            res.status(500).json({
                success: false,
                message: "wholesaler id is required"
            });
        }

    } catch (err) {
        console.error("Whole Saler Dashboard Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

const shopkeeperDashboard = async (req, res) => {
    try {
        if (req.decoded.addedById) {
            const pendingRequests = await Request.countDocuments({ status: "pending", shopkeeperId: req.decoded.addedById });
            const paidRequests = await Request.countDocuments({ paymentStatus: "paid", shopkeeperId: req.decoded.addedById });
            const pendingPayments = await Request.countDocuments({ paymentStatus: "pending", shopkeeperId: req.decoded.addedById });
            res.status(200).json({
                success: true,
                message: "Whole Saler dashboard data loaded successfully",
                data: {
                    pendingRequests,
                    paidRequests,
                    pendingPayments,
                }
            })
        }
        else {
            res.status(500).json({
                success: false,
                message: "wholesaler id is required"
            });
        }

    } catch (err) {
        console.error("Whole Saler Dashboard Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



module.exports = {
    adminDashboard, sales, wholeSalerDashboard, shopkeeperDashboard
};
