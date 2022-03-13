const router = require("express").Router();
const authController = require("./../controllers/authController");
const joiController = require("./../controllers/joiController");
const validateRequest = require("./../../util/validationReq");
const RepotController = require("./../controllers/reportController");

router.use(authController.protect);
router.post("/:id", RepotController.createReport);

router.use(authController.restrictTo("admin", "superAdmin"));

router.get("/", RepotController.getAllReports);
router.post('/check/:id' ,RepotController.checkReport)
module.exports = router;
