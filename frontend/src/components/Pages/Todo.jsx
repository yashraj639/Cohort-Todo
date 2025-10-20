import { useState, useEffect } from "react";
import { Plus, X, Edit3, Check } from "lucide-react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/todo/todos`, {
          withCredentials: true,
        });

        setTodos(data.todos);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Failed to fetch todos. Please try again.";
        console.error("Error fetching todos:", message);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/todo/create`,
        { title: newTodo },
        { withCredentials: true }
      );

      const createdTodo = data.todo ?? {
        _id: data.todoId,
        title: newTodo,
        completed: false,
      };

      setTodos((prev) => [...prev, createdTodo]);
      setNewTodo("");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to add todo. Please try again.";
      console.error("Error adding todo:", errorMsg);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.title);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  const updateTodoText = async (id) => {
    if (!editingText.trim()) return cancelEditing();

    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/todo/update/${id}`,
        { title: editingText.trim() },
        { withCredentials: true }
      );

      setTodos((prev) => prev.map((t) => (t._id === id ? data.todo : t)));
      cancelEditing();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to update todo. Please try again.";
      console.error("Error updating todo:", errorMsg);
      cancelEditing();
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/todo/update/${id}`,
        { title: todo.title, completed: !todo.completed },
        { withCredentials: true }
      );

      setTodos((prev) => prev.map((t) => (t._id === id ? data.todo : t)));
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to toggle todo status.";
      console.error("Error toggling todo:", errorMsg);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todo/delete/${id}`, {
        withCredentials: true,
      });

      setTodos((prev) => prev.filter((t) => t._id !== id));
      if (editingId === id) cancelEditing();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to delete todo. Please try again.";
      console.error("Error deleting todo:", errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-900 via-gray-800 to-black  relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-h-screen">
        <div className="absolute inset-0 z-0 backdrop-blur-sm isolate" />
        {/* Left Side  */}
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

        {/* Right Side - Todo List */}
        <div className="flex flex-col justify-center">
          <div className="rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium text-white"></h2>
                <div className="mt-2 text-sm sm:text-base text-white/60">
                  {todos.filter((t) => !t.completed).length} of {todos.length}
                  remaining
                </div>
              </div>

              {/* Todo List - Mobile Optimized Scrolling */}
              <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-6 max-h-60 sm:max-h-72 md:max-h-80 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo._id}
                    className={`flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 ${
                      todo.completed
                        ? "bg-white/5 border-white/10 text-white/50"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/15 active:bg-white/20 capitalize"
                    }`}
                  >
                    {/* Checkbox - Touch Optimized */}
                    <button
                      onClick={() => toggleTodo(todo._id)}
                      disabled={editingId === todo._id}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 touch-manipulation ${
                        todo.completed
                          ? "bg-green-500 border-green-500 scale-110"
                          : "border-white/40 hover:border-green-400 active:border-green-500"
                      } ${editingId === todo._id ? "opacity-50" : ""}`}
                    >
                      {todo.completed && (
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      )}
                    </button>

                    {/* Text / Edit - Mobile Optimized */}
                    {editingId === todo._id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updateTodoText(todo._id);
                          if (e.key === "Escape") cancelEditing();
                        }}
                        className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 border border-white/30 rounded-lg sm:rounded-xl focus:outline-none bg-white/10 text-white placeholder-white/50 backdrop-blur-sm text-sm sm:text-base"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 text-sm sm:text-base ${
                          todo.completed ? "line-through" : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                    )}

                    {/* Action Buttons - Touch Optimized */}
                    <div className="flex gap-1">
                      {editingId === todo._id ? (
                        <>
                          <button
                            onClick={() => updateTodoText(todo._id)}
                            className="p-1.5 sm:p-2 text-green-400 hover:text-green-300 active:text-green-200 hover:bg-white/10 active:bg-white/15 rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation"
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1.5 sm:p-2 text-white/60 hover:text-white active:text-white hover:bg-white/10 active:bg-white/15 rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(todo)}
                            className="p-1.5 sm:p-2 text-white/60 hover:text-blue-300 active:text-blue-200 hover:bg-white/10 active:bg-white/15 rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation"
                          >
                            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-1.5 sm:p-2 text-white/60 hover:text-red-400 active:text-red-300 hover:bg-white/10  active:bg-white/15 rounded-lg sm:rounded-xl transition-all duration-200 touch-manipulation"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Todo - Mobile Optimized */}
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                  placeholder="Add a new task..."
                  disabled={editingId !== null}
                  className="flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/10 transition-all duration-200 text-sm sm:text-base"
                />
                <button
                  onClick={addTodo}
                  disabled={editingId !== null}
                  className={`px-4 sm:px-6 py-3 sm:py-4 cursor-pointer rounded-xl sm:rounded-2xl bg-blue-500/80 backdrop-blur-md border border-blue-400/50 text-white hover:bg-blue-500 active:bg-blue-600 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 font-medium shadow-lg text-sm sm:text-base touch-manipulation ${
                    editingId !== null ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Add</span>
                </button>
              </div>

              {editingId && (
                <p className="text-xs sm:text-sm text-blue-300 mt-2 sm:mt-3 text-center">
                  Press Enter to save, Escape to cancel
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
