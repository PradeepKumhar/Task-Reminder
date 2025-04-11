const express = require('express');
const Task = require('../models/Task');
const authenticate = require("../middleware/authenticate");
const { default: mongoose } = require('mongoose');
const sendEmail = require("../utils/sendEmail"); // ✅ Import sendEmail

const router = express.Router();

// Create task
router.post("/add", authenticate, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate)
      return res.status(400).send({ error: "Please fill in all fields" });

    const task = new Task({
      userId: req.user._id,
      title,
      description,
      dueDate
    });

    await task.save();

    // ✅ Send Email on creation
    await sendEmail(
      req.user.email,
      "🎯 New Task Created!",
      `Hey ${req.user.name || 'there'},\n\nYour new task "${title}" has been successfully created.\n\n🗓️ Due Date: ${dueDate}\n📝 Description: ${description}\n\nStay productive!\n\n– Task Reminder App`
    );
    

    res.status(201).json({ message: "Task Created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.log(error);
  }
});

// Get user's tasks
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update task
router.put("/update/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, dueDate, status } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;
    if (status !== undefined) updateFields.status = status;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user._id },
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // ✅ Send Email on update
    await sendEmail(
      req.user.email,
      "✏️ Task Updated!",
      `Hi ${req.user.name || 'there'},\n\nYour task "${updatedTask.title}" has been updated.\n\nIf this wasn’t you, please review it.\n\nKeep crushing your goals!\n\n– Task Reminder App`
    );
    

    res.status(200).json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/delete/:taskId", authenticate, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.user._id,
    });

    if (!deletedTask)
      return res.status(404).json({ error: "Task not found" });

    // ✅ Send Email on deletion
    await sendEmail(
      req.user.email,
      "🗑️ Task Deleted",
      `Hello ${req.user.name || 'there'},\n\nYour task "${deletedTask.title}" has been deleted from your list.\n\nIf you deleted it by mistake, you can create it again easily.\n\n– Task Reminder App`
    );
    

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
