const AuthToggle = ({ isSignUp, setIsSignUp }) => {
  return (
    <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 mb-6 border border-white/20">
      <button
        onClick={() => setIsSignUp(false)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          !isSignUp
            ? "bg-white/20 text-white shadow-sm"
            : "text-gray-300 hover:text-white"
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => setIsSignUp(true)}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
          isSignUp
            ? "bg-white/20 text-white shadow-sm"
            : "text-gray-300 hover:text-white"
        }`}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthToggle;
