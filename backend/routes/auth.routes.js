const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/user/signup", authController.signupUser);

router.post("/user/signin", authController.signinUser);

module.exports = router;
