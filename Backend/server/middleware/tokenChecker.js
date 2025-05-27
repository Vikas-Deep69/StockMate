const jwt = require('jsonwebtoken')
const secretKey = '1q2w3e4r5t'


module.exports = (req, res, next) => {
    let token = req.headers.authorization
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.send({
                    success: false,
                    status: 401,
                    message: "Unauthorized Access"
                })
            }
            else {
                req.decoded = decoded;
                req.decoded.addedById = req.decoded._id
                next()
            }
        })
    }
    else {

        res.send({
            success: false,
            status: 404,
            message: "No Token Found"
        })

    }
}