import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

const Pomodoro = () => {
  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroSession, setPomodoroSession] = useState(1);

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro effect
  useEffect(() => {
    let interval = null;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((time) => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      // Timer finished
      setIsRunning(false);
      if (isBreak) {
        // Break finished, start new pomodoro
        setPomodoroTime(25 * 60);
        setIsBreak(false);
        setPomodoroSession((session) => session + 1);
      } else {
        // Pomodoro finished, start break
        setPomodoroTime(5 * 60); // 5 minute break
        setIsBreak(true);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, isBreak]);

  // Format time for clock
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format pomodoro time
  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Pomodoro controls
  const startPomodoro = () => setIsRunning(true);
  const pausePomodoro = () => setIsRunning(false);
  const resetPomodoro = () => {
    setIsRunning(false);
    setPomodoroTime(isBreak ? 5 * 60 : 25 * 60);
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

        {/* Pomodoro Timer */}
        <div className="rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              {isBreak ? (
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mr-2" />
              ) : (
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
              )}
              <h3 className="text-lg sm:text-xl font-medium text-white">
                {isBreak ? "Break Time" : `Pomodoro #${pomodoroSession}`}
              </h3>
            </div>

            <div className="text-3xl sm:text-4xl md:text-5xl font-mono text-white mb-4 sm:mb-6">
              {formatPomodoroTime(pomodoroTime)}
            </div>

            {/* Progress Ring - Responsive */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  stroke={isBreak ? "#f97316" : "#ef4444"}
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    40 *
                    (pomodoroTime / (isBreak ? 5 * 60 : 25 * 60))
                  }`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                    isBreak ? "bg-orange-500" : "bg-red-500"
                  } ${isRunning ? "animate-pulse" : ""}`}
                ></div>
              </div>
            </div>

            {/* Controls - Mobile Optimized */}
            <div className="flex justify-center gap-2 sm:gap-3">
              <button
                onClick={isRunning ? pausePomodoro : startPomodoro}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:bg-white/25 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base touch-manipulation cursor-pointer"
              >
                {isRunning ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={resetPomodoro}
                className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:bg-white/25 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base touch-manipulation cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pomodoro;
