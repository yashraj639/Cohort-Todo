const streakModel = require("../models/streak.model"); 
// Get user's streak data
async function getStreak(req, res) {
  try {
    const userId = req.userId; 

    let streak = await streakModel.findOne({ userId });

    // Create streak record if doesn't exist
    if (!streak) {
      streak = await streakModel.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        totalTasksCompleted: 0,
      });
    }

    if (streak.lastCompletedDate) {
      const lastDate = new Date(streak.lastCompletedDate);
      const today = new Date();
      const diffTime = today - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        streak.currentStreak = 0;
      }
    }

    res.status(200).json({
      success: true,
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        totalTasks: streak.totalTasksCompleted,
        lastCompleted: streak.lastCompletedDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateStreak(req, res) {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    let streak = await streakModel.findOne({ userId });

    if (!streak) {
      streak = await streakModel.create({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedDate: today,
        totalTasksCompleted: 1,
      });
    } else {
      const lastDate = streak.lastCompletedDate;

      // Already completed today - just increment total
      if (lastDate === today) {
        streak.totalTasksCompleted += 1;
      } else {
        // Calculate days difference
        const lastDateObj = new Date(lastDate);
        const todayObj = new Date(today);
        const diffTime = todayObj - lastDateObj;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day - increment streak
          streak.currentStreak += 1;
        } else if (diffDays > 1) {
          // Missed days - reset streak
          streak.currentStreak = 1;
        }

        // Update longest streak if needed
        if (streak.currentStreak > streak.longestStreak) {
          streak.longestStreak = streak.currentStreak;
        }

        streak.lastCompletedDate = today;
        streak.totalTasksCompleted += 1;
      }
    }

    await streak.save();

    res.status(200).json({
      success: true,
      streak: {
        current: streak.currentStreak,
        longest: streak.longestStreak,
        totalTasks: streak.totalTasksCompleted,
        lastCompleted: streak.lastCompletedDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getStreak,
  updateStreak,
};
