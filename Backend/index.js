const express = require("express")
const app = express();
const PORT = 7000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const cors = require('cors')
app.use(cors())
const db = require('./server/config/db')
const seed = require('./server/config/seed')


const routes=require("./server/routes/apiroutes")
app.use("/api",routes);



app.get('/', (req, res) => {
    res.send('welcome to server')
})



app.listen(PORT, (error) => {
    if (error) {
        console.log("error in server", error)

    }
    else {
        console.log('Server is running at port', PORT)

    }
})