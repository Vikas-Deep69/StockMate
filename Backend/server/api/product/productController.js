const Product = require("./productModel");
const { uploadImg } = require("../../utilities/helper");



const add = async (req, res) => {
    try {
        let errMsgs = "";
        if (!req.body.name) errMsgs += "Name is required. ";
        if (!req.body.categoryId) errMsgs += "Category ID is required. ";
        if (!req.body.price) errMsgs += "Price is required. ";
        if (!req.body.stock) errMsgs += "Stock is required. ";
        if (!req.file) errMsgs += "Image is required. ";

        if (errMsgs.length > 0) {
            return res.send({
                status: 422,
                success: false,
                message: errMsgs.trim()
            });
        }

        const alreadyProduct = await Product.findOne({
            name: req.body.name,
            categoryId: req.body.categoryId
        });

        if (alreadyProduct) {
            return res.send({
                status: 409,
                success: false,
                message: "Product already exists in this category."
            });
        }

        let imgUrl = "";
        if (req.file) {
            try {
                imgUrl = await uploadImg(req.file.buffer, `stockmate/products/${Date.now()}`);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.send({
                    status: 500,
                    success: false,
                    message: "Image upload failed. " + err.message
                });
            }
        }

        const count = await Product.countDocuments();

        const productObj = new Product({
            autoId: count + 1,
            name: req.body.name,
            description: req.body.description || "",
            categoryId: req.body.categoryId,
            price: req.body.price,
            stock: req.body.stock,
            unit: req.body.unit || "",
            addedById: req.decoded.addedById,
            image: imgUrl,
        });

        const savedProduct = await productObj.save();

        return res.send({
            status: 200,
            success: true,
            message: "Product added successfully.",
            data: savedProduct
        });

    } catch (err) {
        console.error("Product Add API Error:", err);
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error"
        });
    }
};



const update = async (req, res) => {
    try {
        let validationErrors = "";
        if (!req.body._id) validationErrors += "_id is required. ";

        if (validationErrors) {
            return res.json({ success: false, status: 400, message: validationErrors.trim() });
        }

        const productData = await Product.findOne({ _id: req.body._id });
        if (!productData) {
            return res.json({ success: false, status: 404, message: "Product not found" });
        }

        if (req.file) {
            try {
                const imageUrl = await uploadImg(req.file.buffer, `eventgo/${Date.now()}`);
                productData.image = imageUrl;
            } catch (err) {
                console.error("Image upload failed:", err);
                return res.json({ success: false, status: 500, message: "Image upload failed" });
            }
        }

        if (req.body.name) productData.name = req.body.name;
        if (req.body.unit) productData.unit = req.body.unit;
        if (req.body.categoryId) productData.categoryId = req.body.categoryId;
        if (req.body.price) productData.price = req.body.price;
        if (req.body.stock) productData.stock = req.body.stock;
        if (req.body.description !== undefined) productData.description = req.body.description;

        const updatedConcert = await productData.save();

        return res.json({
            success: true,
            status: 200,
            message: "Product updated successfully",
            data: updatedConcert
        });

    } catch (err) {
        console.error("Update concert error:", err);
        return res.json({ success: false, status: 500, message: "Internal Server Error" });
    }
};
const deleteone = (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "product _id is required"
        });
    }

    Product.findOne({ _id: req.body._id })
        .then((productData) => {
            if (productData) {
                Product.deleteOne({ _id: req.body._id })
                    .then(() => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Product deleted successfully"
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while deleting product"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Product not found"
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
    Product.find(req.body)
        .populate("categoryId")
        .populate("addedById")
        .then((ProductList) => {
            res.json({
                status: 200,
                success: true,
                message: "Product list fetched successfully",
                data: ProductList
            });
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
            message: "_id is required"
        });
    }

    Product.findOne({ _id: req.body._id })
        .populate("categoryId")
        .then((ProductData) => {
            if (ProductData) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Product fetched successfully",
                    data: ProductData
                });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Product not found"
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

const changeStatus = (req, res) => {
    if (!req.body._id || req.body.status == null) {
        return res.json({
            status: 422,
            success: false,
            message: "_id and status are required"
        });
    }

    Product.findOne({ _id: req.body._id })
        .populate("categoryId")
        .then((ProductData) => {
            if (ProductData) {
                ProductData.status = req.body.status;
                ProductData.save()
                    .then((updatedProduct) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Product status changed",
                            data: updatedProduct
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
                    message: "Product not found"
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

        Product.find()
            .populate("categoryId")
            .skip(skip)
            .limit(limit)
            .then((requests) => {
                Product.countDocuments()
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


module.exports = { add, all, single, changeStatus, pagination, deleteone, update };
