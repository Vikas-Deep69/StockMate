const User = require('./userModel')
const jwt = require('jsonwebtoken')
const secretKey = '1q2w3e4r5t'
const bcrypt = require('bcrypt')
const wholesalerModel = require('../wholesaler/wholesalerModel')
const shopkeeperModel = require('../shopkeeper/shopkeeperModel')


const login = (req, res) => {
    let validation = ''
    if (!req.body.email)
        validation += " Email is required "
    if (!req.body.password)
        validation += ' Password is required '
    if (!!validation)
        res.send({ success: false, status: 500, message: validation })
    else {
        User.findOne({ email: req.body.email })
            .then(result => {
                if (result == null)
                    res.send({ success: false, status: 500, message: 'No user Found' })
                if(result.userType == 2){
                        wholesalerModel.findOne({email:req.body.email})
                        .then((data)=>{
                            if(data == null)
                                res.send({ success: false, status: 500, message: 'No user Found' })
                            if(data != null){
                                if(data.request == "pending" && data.request == "reject"){
                                res.send({ success: false, status: 400, message: 'User Inactive contact to admin!!' })
                                }
                                else {
                                    if (bcrypt.compareSync(req.body.password, result.password)) {
                                        if(result.status) {
                                            let payload = {
                                                _id: result._id,
                                                name: result.name,
                                                email: result.email,
                                                UserType: result.userType
                                            }
                                            let token = jwt.sign(payload, secretKey, { expiresIn: '24h' })
                                            res.send({ success: true, status: 200, message: 'Login Successfull', data: result, token: token })
                                        }
                                        else
                                            res.send({ success: false, status: 500, message: 'Your Account Is Blocked' })
                                    }
                                    else {
                                        res.send({ success: false, status: 500, message: "Invalid username Password" })
                                    }
                                }
                                
                            }

                        })
                }
                if(result.userType == 3){
                        shopkeeperModel.findOne({email:req.body.email})
                        .then((data)=>{
                            if(data == null)
                                res.send({ success: false, status: 500, message: 'No user Found' })
                            if(data != null){
                                if(data.request == "pending" && data.request == "reject"){
                                res.send({ success: false, status: 400, message: 'User Inactive contact to admin!!' })
                                }
                                else {
                                    if (bcrypt.compareSync(req.body.password, result.password)) {
                                        if(result.status) {
                                            let payload = {
                                                _id: result._id,
                                                name: result.name,
                                                email: result.email,
                                                UserType: result.userType
                                            }
                                            let token = jwt.sign(payload, secretKey, { expiresIn: '24h' })
                                            res.send({ success: true, status: 200, message: 'Login Successfull', data: result, token: token })
                                        }
                                        else
                                            res.send({ success: false, status: 500, message: 'Your Account Is Blocked' })
                                    }
                                    else {
                                        res.send({ success: false, status: 500, message: "Invalid username Password" })
                                    }
                                }
                                
                            }

                        })
                }
                if(result.userType == 1){                         
                                    if (bcrypt.compareSync(req.body.password, result.password)) {
                                        if(result.status) {
                                            let payload = {
                                                _id: result._id,
                                                name: result.name,
                                                email: result.email,
                                                UserType: result.userType
                                            }
                                            let token = jwt.sign(payload, secretKey, { expiresIn: '24h' })
                                            res.send({ success: true, status: 200, message: 'Login Successfull', data: result, token: token })
                                        }
                                        else
                                            res.send({ success: false, status: 500, message: 'Your Account Is Blocked' })
                                    }
                                    else {
                                        res.send({ success: false, status: 500, message: "Invalid username Password" })
                                    }
                }

           

            })
            .catch(err => {
                res.send({ success: false, status: 500, message: err })
            })
    }
}

const changePassword = async (req, res) => {
    try {
        let validationErrors = "";
        if (!req.body._id) validationErrors += "_id is required. ";
        if (!req.body.oldPassword) validationErrors += "Old Password is required. ";
        if (!req.body.newPassword) validationErrors += "New Password is required. ";
        if (
            req.body.newPassword &&
            req.body.confirmPassword &&
            req.body.newPassword !== req.body.confirmPassword
        ) {
            validationErrors += "New Password and Confirm Password do not match. ";
        }

        if (validationErrors) {
            return res.json({ success: false, status: 422, message: validationErrors.trim() });
        }

        const userData = await User.findOne({ _id: req.body._id });
        if (!userData) {
            return res.json({ success: false, status: 404, message: "User does not exist" });
        }

        if (!userData.status) {
            return res.json({ success: false, status: 403, message: "Your account is blocked. Please contact admin." });
        }

        const isMatch = bcrypt.compareSync(req.body.oldPassword, userData.password);
        if (!isMatch) {
            return res.json({ success: false, status: 400, message: "Old password is incorrect" });
        }

        const hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
        userData.password = hashedPassword;
        await userData.save();

        return res.json({
            success: true,
            status: 200,
            message: "Password changed successfully"
        });

    } catch (err) {
        return res.json({ success: false, status: 500, message: err.message });
    }
};


module.exports = { login, changePassword }