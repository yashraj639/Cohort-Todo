const express = require("express");
const todoController = require("../controllers/todo.controller");
const { auth } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create", auth, todoController.createTodo);

// Read
router.get("/todos", auth, todoController.readTodo);

// Update
router.put("/update/:id", auth, todoController.updateTodo);

// Delete
router.delete("/delete/:id", auth, todoController.deleteTodo);

module.exports = router;
