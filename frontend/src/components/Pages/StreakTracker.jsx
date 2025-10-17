import { useState, useEffect } from "react";
import { Flame, Trophy, Target, TrendingUp } from "lucide-react";

const StreakTracker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [streakData, setStreakData] = useState({
    current: 0,
    longest: 0,
    totalTasks: 0,
    lastCompleted: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchStreakData();
  }, []);

  const fetchStreakData = async () => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
      const response = await fetch(`${BASE_URL}/api/streak/`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setStreakData(data.streak);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStreakPercentage = () => {
    return Math.min((streakData.current / 30) * 100, 100);
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 flex flex-col justify-center">
        {/* Clock */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2 font-mono tracking-wide">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-white/70">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Streak Tracker */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-white/20 border-t-white rounded-full mx-auto"></div>
              <p className="text-white/60 mt-4 text-sm">Loading streak...</p>
            </div>
          ) : (
            <div className="text-center">
              {/* Main Streak Display */}
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 mr-3 animate-pulse" />
                <div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
                    {streakData.current}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 mt-1">
                    Day Streak
                  </div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto mb-6 sm:mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 45 * (1 - getStreakPercentage() / 100)
                    }`}
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {Math.round(getStreakPercentage())}%
                    </div>
                    <div className="text-xs text-white/60">of 30 days</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Longest Streak */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-center">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 my-1" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {streakData.longest}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1">
                    Best Streak
                  </div>
                </div>

                {/* Total Tasks */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div className="flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 my-1" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {streakData.totalTasks}
                  </div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1">
                    Total Tasks
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl sm:rounded-2xl">
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <p className="text-xs sm:text-sm text-white/80">
                    {streakData.current === 0
                      ? "Complete a task to start your streak!"
                      : streakData.current < 7
                      ? "Great start! Keep the momentum going!"
                      : streakData.current < 30
                      ? "You're on fire! Don't break the chain!"
                      : "Incredible! You're a productivity master! 🎉"}
                  </p>
                </div>
              </div>

              {/* Last Completed */}
              {streakData.lastCompleted && (
                <div className="mt-3 text-xs sm:text-sm text-white/50">
                  Last completed:
                  {new Date(streakData.lastCompleted).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StreakTracker;
