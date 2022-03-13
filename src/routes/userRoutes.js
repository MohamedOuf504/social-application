const router = require("express").Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const joiController = require("./../controllers/joiController");
const validateRequest = require("./../../util/validationReq");

router.post(
  "/signup",
  validateRequest(joiController.validRegister),
  authController.signup
);
router.get("/verify/:id", authController.EmailVerification);

router.post(
  "/login",
  validateRequest(joiController.validLogIn),
  authController.login
);
router.post("/forgotPassword", authController.forGetPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.patch('/deactivate', userController.deactivate);

router.use(authController.restrictTo("admin", "superAdmin"));

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.restoreUser)
  .post(userController.blockUser);


router.use(authController.restrictTo("superAdmin"));

  router.route("/superAdmin/Admins")
  .get(userController.getAllAdmin)
  .patch(userController.AddAdmin)
  .delete(userController.deleteAdmin)

module.exports = router;
