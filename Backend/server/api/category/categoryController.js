
const Category = require("./categoryModel");
const { uploadImg } = require("../../utilities/helper");

const add = async (req, res) => {
    const errMsgs = [];
    if (!req.body.name) {
        errMsgs.push("name is required");
    }
    if (!req.file) {
        errMsgs.push("image is required");
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    } else {
        let imgUrl = "Image not uploaded";
        if (req.file) {
            try {
                const imageUrl = await uploadImg(req.file.buffer, `stockmate/category/${Date.now()}`);
                imgUrl = imageUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.json({
                    status: 500,
                    success: false,
                    message: err.message
                });
            }
        }
        const alreadyCategory = await Category.findOne({ name: req.body.name })
        if (alreadyCategory) {
            res.json({
                status: 409,
                sucess: false,
                message: "Category already exists"
            })
        }
        else {
            const count = await Category.countDocuments();
            const categoryObj = new Category();
            categoryObj.autoId = count + 1;
            categoryObj.name = req.body.name;
            categoryObj.image = imgUrl;
            categoryObj.save()
                .then((savedCategory) => {
                    res.json({
                        status: 200,
                        success: true,
                        message: "Category added successfully",
                        data: savedCategory
                    });
                })
                .catch((err) => {
                    res.json({
                        status: 500,
                        success: false,
                        message: "Error while adding category"
                    });
                });
        }
    }
};

const update = async (req, res) => {
    if (!req.body._id) {
        return res.json({
            status: 422,
            success: false,
            message: "category _id is required"
        });
    }

    let imgUrl;
    if (req.file) {
        try {
            const imageUrl = await uploadImg(req.file.buffer, `stockmate/category/${Date.now()}`);
            imgUrl = imageUrl;
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            return res.json({
                status: 500,
                success: false,
                message: err.message
            });
        }
    }




    Category.findOne({ _id: req.body._id })
        .then((categoryData) => {
            if (categoryData) {
                if (req.body.name) {
                    categoryData.name = req.body.name;
                }
                if (req.body.description) {
                    categoryData.description = req.body.description;
                }
                if (imgUrl) {
                    categoryData.image = imgUrl;
                }

                categoryData.save()
                    .then((updatedCategory) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Category updated successfully",
                            data: updatedCategory
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while updating category"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Category not found"
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
            message: "category _id is required"
        });
    }

    Category.findOne({ _id: req.body._id })
        .then((categoryData) => {
            if (categoryData) {
                Category.deleteOne({ _id: req.body._id })
                    .then(() => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Category deleted successfully"
                        });
                    })
                    .catch((err) => {
                        res.json({
                            status: 500,
                            success: false,
                            message: "Error while deleting category"
                        });
                    });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Category not found"
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
    Category.find(req.body)
        .then((categoryList) => {
            res.json({
                status: 200,
                success: true,
                message: "Category list fetched successfully",
                data: categoryList
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

    Category.findOne({ _id: req.body._id })
        .then((categoryData) => {
            if (categoryData) {
                res.json({
                    status: 200,
                    success: true,
                    message: "Category fetched successfully",
                    data: categoryData
                });
            } else {
                res.json({
                    status: 404,
                    success: false,
                    message: "Category not found"
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

    Category.findOne({ _id: req.body._id })
        .then((categoryData) => {
            if (categoryData) {
                categoryData.status = req.body.status;
                categoryData.save()
                    .then((updatedCategory) => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Category status changed",
                            data: updatedCategory
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
                    message: "Category not found"
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

        Category.find()
            .skip(skip)
            .limit(limit)
            .then((requests) => {
                Category.countDocuments()
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

module.exports = { add, all, single, changeStatus, pagination, deleteone, update }