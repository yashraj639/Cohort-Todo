const express = require("express");
const streakController = require("../controllers/streak.controller");
const { auth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", auth, streakController.getStreak);

router.post("/complete", auth, streakController.updateStreak);

module.exports = router;
