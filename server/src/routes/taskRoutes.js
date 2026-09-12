const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addDependency,
  removeDependency,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware); // every route below requires a valid token

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.post("/:id/dependencies", addDependency);
router.delete("/:id/dependencies/:dependencyId",removeDependency);

module.exports = router;

