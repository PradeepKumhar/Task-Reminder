const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
userId: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: {type:String, required: true },
description: {type:String, required: true },
dueDate:{type:Date, required: true },
status: {type:String, enum: ['pending', 'inProgress', 'done'], default:"pending"},
createdAt: {type:Date, default: Date.now },
});

module.exports = mongoose.model("Task",taskSchema);
