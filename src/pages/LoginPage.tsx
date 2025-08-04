import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const navigate = useNavigate();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);
  
  // Redirect to calendar when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("🎯 User authenticated, redirecting to calendar...");
      navigate("/calendar");
    }
  }, [isAuthenticated, navigate]);
  
  // Clear loading state when authentication succeeds
  useEffect(() => {
    if (isAuthenticated && isLoading) {
      console.log("🎉 Authentication detected! Clearing loading state...");
      setIsLoading(false);
      setError(null);
    }
  }, [isAuthenticated, isLoading]);
  
  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return "";
  };
  
  // Real-time validation
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };
  
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    
    if (emailErr || passwordErr) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", flow);
      
      console.log("🔑 Starting authentication...", { email, flow });
      await signIn("password", formData);
      console.log("✅ SignIn completed successfully!");
      
      // Navigation will happen in useEffect when isAuthenticated becomes true
      
    } catch (error: any) {
      console.error("❌ Authentication failed:", error);
      
      // Better error messages based on error type
      let errorMessage = "An error occurred during authentication";
      
      if (error.message) {
        if (error.message.includes("Invalid credentials")) {
          errorMessage = flow === "signIn" 
            ? "Invalid email or password. Please check your credentials and try again."
            : "Account creation failed. This email might already be registered.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "No account found with this email. Please sign up first.";
        } else if (error.message.includes("Password")) {
          errorMessage = "Password requirements not met. Please ensure your password is at least 8 characters long.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };
  
  const isFormValid = !emailError && !passwordError && email && password;
  
  return (
    <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center p-4">
      <div className="flex flex-col gap-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-dark dark:text-light mb-2">
            Welcome to Picnic
          </h1>
          <h2 className="text-xl font-medium text-dark dark:text-light mb-2">
            {flow === "signIn" ? "Welcome back!" : "Create your account"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {flow === "signIn" 
              ? "Sign in to access your calendar" 
              : "Join Picnic to start organizing your events"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-dark dark:text-light">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Enter your email"
              className={`w-full bg-light dark:bg-dark text-dark dark:text-light rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emailError 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              disabled={isLoading}
              required
            />
            {emailError && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                <span className="text-xs">⚠️</span>
                {emailError}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-dark dark:text-light">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onFocus={() => setShowPasswordHelp(true)}
              onBlur={() => setShowPasswordHelp(false)}
              placeholder={flow === "signIn" ? "Enter your password" : "Create a password"}
              className={`w-full bg-light dark:bg-dark text-dark dark:text-light rounded-lg p-3 border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                passwordError 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
              disabled={isLoading}
              required
              minLength={8}
            />
            
            {/* Password Requirements */}
            {(showPasswordHelp || passwordError) && flow === "signUp" && (
              <div className="text-sm space-y-1">
                <p className="text-slate-600 dark:text-slate-400">Password requirements:</p>
                <div className="flex items-center gap-2">
                  <span className={password.length >= 8 ? "text-green-500" : "text-slate-400"}>
                    {password.length >= 8 ? "✓" : "○"}
                  </span>
                  <span className={password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-slate-600 dark:text-slate-400"}>
                    At least 8 characters
                  </span>
                </div>
              </div>
            )}
            
            {passwordError && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                <span className="text-xs">⚠️</span>
                {passwordError}
              </p>
            )}
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              isFormValid && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                : "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {isAuthenticated ? "Redirecting to calendar..." : flow === "signIn" ? "Signing in..." : "Creating account..."}
              </div>
            ) : (
              flow === "signIn" ? "Sign In" : "Create Account"
            )}
          </button>
          
          {/* Toggle Sign In/Up */}
          <div className="text-center pt-2">
            <span className="text-slate-600 dark:text-slate-400">
              {flow === "signIn" ? "New to Picnic? " : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={() => {
                setFlow(flow === "signIn" ? "signUp" : "signIn");
                setError(null);
                setEmailError("");
                setPasswordError("");
              }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              disabled={isLoading}
            >
              {flow === "signIn" ? "Create an account" : "Sign in instead"}
            </button>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500 dark:text-red-400 text-sm">🚨</span>
                <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                  Authentication Error
                </p>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}