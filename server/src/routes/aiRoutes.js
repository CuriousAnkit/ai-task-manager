const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { parseAndCreateTask, getDigest } = require("../controllers/aiController");

const router = express.Router();

router.use(authMiddleware);

router.post("/parse-task", parseAndCreateTask);
router.get("/digest", getDigest)

module.exports = router;