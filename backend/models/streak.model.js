const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: String, default: null }, 
  totalTasksCompleted: { type: Number, default: 0 },
});

const streakModel = mongoose.model("streak", streakSchema);

module.exports = streakModel;
