const Shopkeeper = require("./shopkeeperModel")
const User = require("../user/userModel")
const bcrypt = require("bcrypt");
const { uploadImg } = require("../../utilities/helper");

const register = async (req, res) => {
    const errMsgs = [];
    if (!req.body.name) {
        errMsgs.push("name is required")
    }
    if (!req.body.email) {
        errMsgs.push("email is required")
    }
    if (!req.body.password) {
        errMsgs.push("password is required")
    }
    if (!req.body.contact) {
        errMsgs.push("contact is required")
    }
    if (!req.body.address) {
        errMsgs.push("address is required")
    }
    if (!req.file) {
        errMsgs.push("profile is required")
    }
    if (errMsgs.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    }
    else {
        let imgUrl = "Image not uploaded";
        if (req.file) {
            try {
                const profileUrl = await uploadImg(req.file.buffer, `stockmate/shopkeeper/${Date.now()}`);
                imgUrl = profileUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.json({
                    status: 500,
                    success: false,
                    message: "Image upload failed"
                });
            }
        }
        User.findOne({ email: req.body.email })
            .then(async (isDataExists) => {
                if (!isDataExists) {
                    const count = await User.countDocuments();
                    const userObj = new User();
                    userObj.autoId = count + 1;
                    userObj.name = req.body.name;
                    userObj.email = req.body.email;
                    userObj.password = bcrypt.hashSync(req.body.password, 10);
                    userObj.name = req.body.name;
                    userObj.userType = 3;
                    userObj.save()
                        .then(async (savedUser) => {
                            const count = await Shopkeeper.countDocuments();
                            const shopkeeperObj = new Shopkeeper();
                            shopkeeperObj.autoId = count + 1;
                            shopkeeperObj.name = req.body.name;
                            shopkeeperObj.email = req.body.email;
                            shopkeeperObj.contact = req.body.contact;
                            shopkeeperObj.address = req.body.address;
                            shopkeeperObj.userId = savedUser._id;
                            shopkeeperObj.profile = imgUrl
                            shopkeeperObj.save()
                                .then((savedShopkeeper) => {
                                    res.json({
                                        status: 200,
                                        success: true,
                                        message: "Register request send to admin wait for approved",
                                        data: savedShopkeeper
                                    })
                                })
                                .catch((err) => {
                                    res.json({
                                        status: 400,
                                        success: false,
                                        message: "error while registering shopkeeper"
                                    })
                                })
                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "error while registering shopkeeper"
                            })
                        })
                }
                else {
                    res.json({
                        status: 409,
                        success: false,
                        message: "email already exists"
                    })
                }
            })
            .catch((err) => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal Server Error"
                })
            })
    }
}

const all = (req, res) => {
    Shopkeeper.find(req.body).populate('userId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All shopkeepers Loaded",
                data: data,
                total: data.length
            })
        })
        .catch((err) => {
            res.send({
                success: false,
                status: 500,
                message: err.message
            })
        })
}

const single = (req, res) => {
    if (!req.body._id) {
        res.send({
            status: 422,
            success: false,
            message: "_id is required"
        });
    }
    else {
        Shopkeeper.findOne({ userId: req.body._id }).populate('userId')
            .then((shopkeeperData) => {
                if (shopkeeperData == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found!!",
                    });
                }
                else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Single record loaded!!",
                        data: shopkeeperData
                    });
                }
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

const deleteone = (req, res) => {
    if (!req.body._id) {
        res.send({
            status: 422,
            success: false,
            message: "_id is required!!"
        });
    }
    else {
        Shopkeeper.findOne({ _id: req.body._id })
            .then((shopkeeperData) => {
                if (!shopkeeperData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Shopkeeper not found!!",
                    });
                }
                else {
                    // First delete the student
                    Shopkeeper.deleteOne({ _id: req.body._id })
                        .then(() => {
                            User.deleteOne({ _id: shopkeeperData.userId })
                                .then(() => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Shopkeeper deleted successfully!!",
                                    });
                                })
                                .catch((err) => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: " failed to delete Shopkeeper",
                                        errmessages: err
                                    });
                                });
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Failed to delete Shopkeeper",
                                errmessages: err
                            });
                        });
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Error finding Shopkeeper",
                    errmessages: err
                });
            });
    }
};

const changestatus = (req, res) => {
    if (!req.body._id || req.body.status === undefined) {
        res.send({
            status: 422,
            success: false,
            message: "_id and status are required!!"
        });
    }
    else {
        Shopkeeper.findOne({ _id: req.body._id })
            .then((shopkeeperData) => {
                if (!shopkeeperData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Shopkeeper not found!!",
                    });
                }
                else {
                    shopkeeperData.status = req.body.status;
                    shopkeeperData.save()
                        .then(() => {
                            User.findOne({ _id: shopkeeperData.userId })
                                .then((userData) => {
                                    if (userData) {
                                        userData.status = req.body.status;
                                        userData.save();
                                    }
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Status updated successfully",
                                        data: shopkeeperData
                                    });
                                });
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Failed to save changes",
                                errmessages: err
                            });
                        });
                }
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

const update = async (req, res) => {
    const errMsgs = [];
    if (!req.body._id) {
        errMsgs.push("_id is required");
    }

    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    } else {
        let imgUrl = "Image not uploaded";
        if (req.file) {
            try {
                const profileUrl = await uploadImg(req.file.buffer, `stockmate/shopkeeper/${Date.now()}`);
                imgUrl = profileUrl;
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.json({
                    status: 500,
                    success: false,
                    message: "Image upload failed"
                });
            }
        }

        Shopkeeper.findOne({ _id: req.body._id })
            .then(async (shopkeeper) => {
                if (!shopkeeper) {
                    return res.json({
                        status: 404,
                        success: false,
                        message: "Shopkeeper not found"
                    });
                }

                if (req.body.name) shopkeeper.name = req.body.name;
                if (req.body.contact) shopkeeper.contact = req.body.contact;
                if (req.body.address) shopkeeper.address = req.body.address;
                if (req.file) shopkeeper.profile = imgUrl;
                if (req.body.email) {
                    const isExistsEmail = await User.findOne({ email: req.body.email })
                    if (isExistsEmail) {
                        res.send({
                            status: 402,
                            success: false,
                            message: "This email already exists"
                        })
                    }
                    else {
                        shopkeeper.email = req.body.email;
                    }
                }
                shopkeeper.save()
                    .then((shopkeeperData) => {
                        User.findOne({ _id: shopkeeper.userId })
                            .then((user) => {
                                if (user) {
                                    user.name = req.body.name;
                                    user.email = shopkeeperData.email;
                                    user.save()
                                        .then(() => {
                                            res.json({
                                                status: 200,
                                                success: true,
                                                message: "Shopkeeper updated successfully",
                                                data: shopkeeperData
                                            });
                                        })
                                        .catch(() => {
                                            res.json({
                                                status: 500,
                                                success: false,
                                                message: "Error while updating user name"
                                            });
                                        });
                                } else {
                                    res.json({
                                        status: 404,
                                        success: false,
                                        message: "User not found"
                                    });
                                }
                            })
                            .catch(() => {
                                res.json({
                                    status: 500,
                                    success: false,
                                    message: "Internal server error"
                                });
                            });
                    })
                    .catch(() => {
                        res.json({
                            status: 400,
                            success: false,
                            message: "Error while updating shopkeeper"
                        });
                    });
            })
            .catch(() => {
                res.json({
                    status: 500,
                    success: false,
                    message: "Internal server error"
                });
            });
    }
};

const changeRequestStatus = (req, res) => {
    const errMsgs = "";
    if (!req.body._id) {
        errMsgs += "_id is required";
    }
    
    if (!req.body.request) {
        errMsgs += "request is required approve or decline"
    }
    if (errMsgs.length > 0) {
        return res.send({
            status: 422,
            success: false,
            message: errMsgs,
        });
    } else {
        Shopkeeper.findOne({ _id: req.body._id })
            .then((data) => {
                if (data) {
                    data.request = req.body.request;
                    data.save()
                        .then((savedData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Shopkeeper request " + req.body.request,
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

        Shopkeeper.find()
            .populate('userId')
            .skip(skip)
            .limit(limit)
            .then((requests) => {
                Shopkeeper.countDocuments()
                    .then((totalCount) => {
                        res.send({
                            status: 200,
                            success: true,
                            message: "Requests loaded successfully!!",
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
module.exports = { register, all, single, pagination, changestatus, deleteone, update, changeRequestStatus }