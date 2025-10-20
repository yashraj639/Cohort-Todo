import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let payload = {};

      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          return toast.error("❌ Passwords do not match");
        }
        endpoint = "/api/auth/user/signup";
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
      } else {
        endpoint = "/api/auth/user/signin";
        payload = {
          email: formData.email,
          password: formData.password,
        };
      }

      const { data } = await axios.post(`${endpoint}`, payload, {
        withCredentials: true,
      });

      toast.success(
        isSignUp ? "🎉 Account Created Successfully" : "🎉 Signin Successful"
      );
      navigate("/todo");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      console.error("Error:", message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      {isSignUp && (
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all"
            required={isSignUp}
          />
        </div>
      )}

      {/* Email Field */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20
          text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all"
          required
        />
      </div>

      {/* Password Field */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-800 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {formData.password.length > 0 && formData.password.length < 6 && (
        <p className="text-xs text-red-300 mt-1.5">
          Password must be at least 6 characters
        </p>
      )}

      {/* Confirm Password Field */}
      {isSignUp && (
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-all"
            required={isSignUp}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-800 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 group mt-6"
      >
        {isSignUp ? "Create Account" : "Sign In"}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
};

export default AuthForm;
