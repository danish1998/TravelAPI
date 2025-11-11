const express = require("express");
const { getAllGeneratedPlans, getGeneratedPlansById } = require("../Controllers/aiGenerateController");

const router = express.Router();



router.get("/plans", getAllGeneratedPlans);
router.get("/plans/:id", getGeneratedPlansById);

module.exports = router;