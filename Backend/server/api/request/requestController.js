const Request = require("./requestModel")
const Product = require("../product/productModel")
const Razorpay = require("razorpay");


const add = async (req, res) => {
    try {
        let errors = "";

        const { shopkeeperId, products } = req.body;

        if (!shopkeeperId) errors += "Shopkeeper ID is required. ";
        if (!products || products.length === 0) errors += "At least one product is required. ";

        if (errors) {
            return res.json({ success: false, status: 400, message: errors.trim() });
        }

        const productsByWholesaler = {};

        for (let p of products) {
            const product = await Product.findById(p._id).populate("addedById");
            if (!product) {
                return res.json({ success: false, status: 404, message: `Product with ID ${p._id} not found` });
            }

            if (product.stock < p.quantity) {
                return res.json({ success: false, status: 400, message: `Insufficient stock for product ${product.name}` });
            }

            const wholesalerId = product.addedById._id.toString();

            if (!productsByWholesaler[wholesalerId]) {
                productsByWholesaler[wholesalerId] = [];
            }

            productsByWholesaler[wholesalerId].push({
                productRef: product,
                quantity: p.quantity
            });
        }

        const savedRequests = [];


        for (const [wholesalerId, items] of Object.entries(productsByWholesaler)) {
            let totalAmount = 0;
            const finalProducts = [];

            for (const item of items) {
                const product = item.productRef;
                const quantity = item.quantity;

                totalAmount += product.price * quantity;


                product.stock -= quantity;
                await product.save();

                finalProducts.push({
                    productId: product._id,
                    quantity,
                    wholesalerId: wholesalerId
                });
            }

            const newRequest = new Request({
                shopkeeperId,
                products: finalProducts,
                wholesalerId: wholesalerId,
                totalAmount,
                paymentType: req.body.paymentType || '',
                paymentStatus: req.body.paymentStatus || 'pending',
                meetingLink: req.body.meetingLink || ''
            });

            const savedRequest = await newRequest.save();
            savedRequests.push(savedRequest);
        }

        return res.json({
            success: true,
            status: 201,
            message: "Requests submitted successfully to all wholesalers.",
            data: savedRequests
        });

    } catch (err) {
        console.error("Add request error:", err);
        return res.json({ success: false, status: 500, message: err.message });
    }
};


const update = async (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "request _id is required"
        });
    }
    Request.findOne({ _id: req.body._id })
        .then((requestData) => {
            if (requestData) {
                if (req.body.meetingLink) {
                    requestData.meetingLink = req.body.meetingLink;
                }
                requestData.save()
                    .then((updatedRequest) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Request updated successfully",
                            data: updatedRequest
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while updating request"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Request not found"
                });
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal Server Error"
            });
        });
};

const single = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "request _id is required"
        });
    }

    Request.findOne({ _id: req.body._id })
        .populate("shopkeeperId")
        .populate("wholesalerId")
        .populate({
            path: "products.productId",
            populate: { path: "addedById" }
        })
        .then((requestData) => {
            if (requestData) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Request fetched successfully",
                    data: requestData
                });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Request not found"
                });
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal Server Error"
            });
        });
};


const all = (req, res) => {
    Request.find(req.body)
        .populate("shopkeeperId")
        .populate("products.productId")
        .populate("wholesalerId")
        .then((requestList) => {
            res.json({
                status: 200,
                success: true,
                message: "All requests fetched successfully",
                data: requestList
            });
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Error while fetching requests"
            });
        });
};

const changeStatus = (req, res) => {
    if (!req.body._id || !req.body.status) {
        return res.json({
            status: 422,
            success: false,
            message: "_id and status are required"
        });
    }

    Request.findOne({ _id: req.body._id })
        .then((RequestData) => {
            if (RequestData) {
                RequestData.status = req.body.status;
                RequestData.save()
                    .then((updatedRequest) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Request status changed",
                            data: updatedRequest
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while changing status"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Request not found"
                });
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal Server Error"
            });
        });
};

const deleteone = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "Request _id is required"
        });
    }

    Request.findOne({ _id: req.body._id })
        .then((RequestData) => {
            if (RequestData) {
                Request.deleteOne({ _id: req.body._id })
                    .then(() => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Request deleted successfully"
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while deleting Request"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Request not found"
                });
            }
        })
        .catch((err) => {
            res.json({
                status: 500,
                success: false,
                message: "Internal Server Error"
            });
        });
};


const pagination = (req, res) => {
    var errMsgs = [];
    if (!req.body.pageno) errMsgs.push("pageno is required!!");
    if (!req.body.limit) errMsgs.push("limit is required!!");

    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    }
    else {
        let limit = parseInt(req.body.limit);
        let pageno = parseInt(req.body.pageno);
        let skip = (pageno - 1) * limit;

        Request.find()
            .populate("shopkeeperId")
            .populate("productId")
            .skip(skip)
            .limit(limit)
            .then((requests) => {
                Request.countDocuments()
                    .then((totalCount) => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "data loaded successfully!!",
                            totalCount: totalCount,
                            currentPage: pageno,
                            totalPages: Math.ceil(totalCount / limit),
                            data: requests,

                        });
                    })
                    .catch((err) => {
                        res.send({
                            status: 500,
                            success: false,
                            message: "Internal server error",
                            errmessages: err
                        });
                    });
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmessages: err
                });
            });
    }
};

const changeRequestStatus = (req, res) => {
    const errMsgs = [];
    if (!req.body._id) {
        errMsgs.push("_id is required");
    }
    if (req.body.status == null) {
        errMsgs.push("status is required ")
    }
    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    } else {
        Request.findOne({ _id: req.body._id })
            .then((data) => {
                if (data) {
                    data.status = req.body.status;
                    data.save()
                        .then((savedData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Request updated " + req.body.status,
                                data: savedData
                            });
                        })
                        .catch(() => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "Error while changeRequestStatus"
                            });
                        })
                }
                else {
                    res.json({
                        status: 409,
                        success: false,
                        message: "data not found",
                    });
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error"
                });
            })
    }
}

const pay = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                success: false,
                message: "_id is required."
            });
        }

        const r = await Request.findById(_id);
        if (!r) {
            return res.status(404).json({
                success: false,
                message: "Request not found."
            });
        }

        const razorpay = new Razorpay({
            key_id: 'rzp_test_81m41n13O8OvjC',
            key_secret: '0yEv1mJbIxS9SowEyrJ1DtTK'
        });

        const options = {
            amount: r.totalAmount * 100, 
            currency: "INR",
            receipt: "receipt_order_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        r.paymentType = "online";
        r.paymentStatus = "paid";
        await r.save();

        return res.status(200).json({
            success: true,
            message: "Razorpay order created",
            order,
            totalAmount: r.totalAmount
        });

    } catch (err) {
        console.error(" Razorpay Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Server error occurred"
        });
    }
};





module.exports = { add, all, single, changeStatus, pagination, deleteone, update, changeRequestStatus, pay };

