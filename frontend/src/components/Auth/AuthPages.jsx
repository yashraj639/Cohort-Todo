import { useState } from "react";
import { Clock } from "lucide-react";
import AuthToggle from "../Auth/AuthToggle";
import AuthForm from "../Auth/AuthForm";

const AuthPages = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle floating stars/particles background if you want later */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full border border-white/20 flex items-center justify-center mb-4 bg-white/10 backdrop-blur-lg shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Focus Timer</h1>
          <p className="text-gray-300">Your productivity companion</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <AuthToggle isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
          <AuthForm isSignUp={isSignUp} />

          <div className="text-center mt-6 text-xs text-gray-400">
            © 2025 Focus Timer ✦ Frosted for vibes
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
