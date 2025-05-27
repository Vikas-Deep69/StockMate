const mongoose = require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/STOCKMATE")
mongoose.connect("mongodb+srv://simran:simran123@simclus.0jgbx.mongodb.net/STOCKMATE")
    .then(() => {
        console.log('Db Connected')
    })
    .catch((err) => {
        console.log("Db Error", err)
    })


