const routes = require("express").Router()
const shopkeeperController = require("../api/shopkeeper/shopkeeperController")
const wholesalerController = require("../api/wholesaler/wholesalerController")
const categoryController = require("../api/category/categoryController")
const productController = require("../api/product/productController")
const requestController = require("../api/request/requestController")
const userController = require("../api/user/userController")
const dashBoard = require("../api/dashboard/dashboardController")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


//withput aunthorization
routes.post("/login", userController.login)
//wholesaler
routes.post("/wholesaler/add", upload.single("profile"), wholesalerController.register)


//shopkeeper
routes.post("/shopkeeper/add", upload.single("profile"), shopkeeperController.register)
routes.post("/category/all", categoryController.all)
routes.post("/product/all", productController.all)


routes.use(require("../middleware/tokenChecker"))


routes.post("/admin/dashboard", dashBoard.adminDashboard);
routes.post("/wholesaler/dashboard", dashBoard.wholeSalerDashboard);
routes.post("/shopkeeper/dashboard", dashBoard.shopkeeperDashboard);

routes.post("/sales", dashBoard.sales);

routes.post("/user/changepassword", userController.changePassword)




routes.post("/shopkeeper/update", upload.single("profile"), shopkeeperController.update)
routes.post("/shopkeeper/all", shopkeeperController.all)
routes.post("/shopkeeper/single", shopkeeperController.single)
routes.post("/shopkeeper/delete", shopkeeperController.deleteone)
routes.post("/shopkeeper/pagination", shopkeeperController.pagination)
routes.post("/shopkeeper/changestatus", shopkeeperController.changestatus)

routes.post("/shopkeeper/requeststatus", shopkeeperController.changeRequestStatus)




routes.post("/wholesaler/update", upload.single("profile"), wholesalerController.update)


routes.post("/wholesaler/all", wholesalerController.all)
routes.post("/wholesaler/single", wholesalerController.single)
routes.post("/wholesaler/delete", wholesalerController.deleteone)
routes.post("/wholesaler/pagination", wholesalerController.pagination)
routes.post("/wholesaler/changestatus", wholesalerController.changestatus)
routes.post("/wholesaler/requeststatus", wholesalerController.changeRequestStatus)


//category
routes.post("/category/add", upload.single("image"), categoryController.add)

routes.post("/category/single", categoryController.single)
routes.post("/category/update", upload.single("image"), categoryController.update)
routes.post("/category/delete", categoryController.deleteone)
routes.post("/category/changeStatus", categoryController.changeStatus)
routes.post("/category/pagination", categoryController.pagination)

//product
routes.post("/product/add", upload.single("image"), productController.add)
routes.post("/product/update", upload.single("image"), productController.update)

routes.post("/product/delete", productController.deleteone)
routes.post("/product/changestatus", productController.changeStatus)
routes.post("/product/pagination", productController.pagination)
routes.post("/product/single", productController.single)

//request
routes.post("/request/add", requestController.add)
routes.post("/request/pay", requestController.pay)
routes.post("/request/all", requestController.all)
routes.post("/request/delete", requestController.deleteone)
routes.post("/request/update", requestController.update)
routes.post("/request/single", requestController.single)
routes.post("/request/pagination", requestController.pagination)
routes.post("/request/requeststatus", requestController.changeRequestStatus)
routes.post("/request/changestatus", requestController.changeStatus)


module.exports = routes;