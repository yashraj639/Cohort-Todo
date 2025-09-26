const todoModel = require("../models/todo.model");
const { z } = require("zod");

async function createTodo(req, res) {
  const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    completed: z.boolean().default(false),
  });
  const parseResult = todoSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const { title, completed } = parseResult.data;
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const todo = await todoModel.create({
      title,
      completed: completed ?? false,
      userId,
    });
    res.status(201).json({ message: "Todo created", todoId: todo._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}

async function readTodo(req, res) {
  try {
    const todos = await todoModel.find({ userId: req.userId });
    res.json({ todos });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}

async function updateTodo(req, res) {
  const updateSchema = z.object({
    title: z.string().optional(),

    completed: z.boolean().optional(),
  });

  const parseResult = updateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }

  const { title, completed } = parseResult.data;

  const todo = await todoModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    {
      ...(title && { title }),

      ...(completed !== undefined && { completed }),
    },
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo updated", todo });
}

async function deleteTodo(req, res) {
  const todo = await todoModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted" });
}

module.exports = {
  createTodo,
  readTodo,
  updateTodo,
  deleteTodo,
};
