var  express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
var AdminAuth = require("../middleware/AdminAuth");

router.get('/', HomeController.index);
router.post('/User', UserController.create);
router.get('/User',AdminAuth, UserController.index);
router.get("/User/:id",AdminAuth, UserController.findUser);
router.put("/User/:id",AdminAuth, UserController.edit);
router.delete("/User/:id",AdminAuth, UserController.remove);
router.post("/login", UserController.login);

module.exports = router;