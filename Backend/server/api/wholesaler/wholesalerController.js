const wholesaler = require("./wholesalerModel")
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
                const profileUrl = await uploadImg(req.file.buffer, `stockmate/wholesaler/${Date.now()}`);
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
                    userObj.userType = 2;
                    userObj.save()
                        .then(async (savedUser) => {
                            const count = await wholesaler.countDocuments();
                            const wholesalerObj = new wholesaler();
                            wholesalerObj.autoId = count + 1;
                            wholesalerObj.name = req.body.name;
                            wholesalerObj.email = req.body.email;
                            wholesalerObj.contact = req.body.contact;
                            wholesalerObj.address = req.body.address;
                            wholesalerObj.userId = savedUser._id;
                            wholesalerObj.profile = imgUrl
                            wholesalerObj.save()
                                .then((savedwholesaler) => {
                                    res.json({
                                        status: 200,
                                        success: true,
                                        message: "Register request send to admin wait for approved",
                                        data: savedwholesaler
                                    })
                                })
                                .catch((err) => {
                                    res.json({
                                        status: 400,
                                        success: false,
                                        message: "error while registering wholesaler"
                                    })
                                })
                        })
                        .catch((err) => {
                            res.json({
                                status: 500,
                                success: false,
                                message: "error while registering wholesaler"
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
    wholesaler.find(req.body).populate('userId')
        .then((data) => {
            res.send({
                success: true,
                status: 200,
                message: "All wholesalers Loaded",
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
        wholesaler.findOne({ userId: req.body._id }).populate('userId')
            .then((wholesalerData) => {
                if (wholesalerData == null) {
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
                        data: wholesalerData
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
        wholesaler.findOne({ _id: req.body._id })
            .then((wholesalerData) => {
                if (!wholesalerData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "wholesaler not found!!",
                    });
                }
                else {
                    // First delete the student
                    wholesaler.deleteOne({ _id: req.body._id })
                        .then(() => {
                            User.deleteOne({ _id: wholesalerData.userId })
                                .then(() => {
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "wholesaler deleted successfully!!",
                                    });
                                })
                                .catch((err) => {
                                    res.send({
                                        status: 500,
                                        success: false,
                                        message: " failed to delete wholesaler",
                                        errmessages: err
                                    });
                                });
                        })
                        .catch((err) => {
                            res.send({
                                status: 500,
                                success: false,
                                message: "Failed to delete wholesaler",
                                errmessages: err
                            });
                        });
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Error finding wholesaler",
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
        wholesaler.findOne({ _id: req.body._id })
            .then((wholesalerData) => {
                if (!wholesalerData) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "wholesaler not found!!",
                    });
                }
                else {
                    wholesalerData.status = req.body.status;
                    wholesalerData.save()
                        .then(() => {
                            User.findOne({ _id: wholesalerData.userId })
                                .then((userData) => {
                                    if (userData) {
                                        userData.status = req.body.status;
                                        userData.save();
                                    }
                                    res.send({
                                        status: 200,
                                        success: true,
                                        message: "Status updated successfully",
                                        data: wholesalerData
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
    if (!req.body._id) {
        return res.send({
            status: 422,
            success: false,
            message: "_id is required",
        });
    }

    let imgUrl = null;
    if (req.file) {
        try {
            const profileUrl = await uploadImg(req.file.buffer, `stockmate/wholesaler/${Date.now()}`);
            imgUrl = profileUrl;
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            return res.send({
                status: 500,
                success: false,
                message: "Image upload failed",
            });
        }
    }

    try {
        const wholesalerData = await wholesaler.findOne({ userId: req.body._id });
        if (!wholesalerData) {
            return res.send({
                status: 404,
                success: false,
                message: "Wholesaler not found",
            });
        }

        if (req.body.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists && emailExists._id.toString() !== wholesalerData.userId.toString()) {
                return res.send({
                    status: 409,
                    success: false,
                    message: "This email already exists",
                });
            }
            wholesalerData.email = req.body.email;
        }

        if (req.body.name) wholesalerData.name = req.body.name;
        if (req.body.contact) wholesalerData.contact = req.body.contact;
        if (req.body.address) wholesalerData.address = req.body.address;
        if (imgUrl) wholesalerData.profile = imgUrl;

        const updatedWholesaler = await wholesalerData.save();

        const user = await User.findById(wholesalerData.userId);
        if (!user) {
            return res.send({
                status: 404,
                success: false,
                message: "Associated user not found",
            });
        }

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;

        await user.save();

        return res.send({
            status: 200,
            success: true,
            message: "Wholesaler updated successfully",
            data: updatedWholesaler,
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.send({
            status: 500,
            success: false,
            message: "Internal server error",
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
        wholesaler.findOne({ _id: req.body._id })
            .then((data) => {
                if (data) {
                    data.request = req.body.request;
                    data.save()
                        .then((savedData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "wholesaler request " + req.body.request,
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

        wholesaler.find()
            .populate('userId')
            .skip(skip)
            .limit(limit)
            .then((requests) => {
                wholesaler.countDocuments()
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