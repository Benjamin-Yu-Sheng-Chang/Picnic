import { useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      console.log("🔒 User not authenticated, redirecting to login...");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show login redirect message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-light dark:bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Redirecting to login...</p>
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-light dark:bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-dark dark:text-light">
              Settings
            </h1>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              ✅ Signed In
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/calendar")}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Calendar
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Settings
              </button>
            </nav>
            
            <button
              onClick={() => {
                console.log("🚪 Signing out...");
                signOut();
              }}
              className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-dark dark:text-light rounded-lg px-4 py-2 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-2">
            Account Settings
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account preferences and security settings
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
              Profile Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark dark:text-light mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full bg-light dark:bg-dark text-dark dark:text-light rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                  placeholder="your@email.com"
                  disabled
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Email changes are not yet supported
                </p>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
              Security
            </h3>
            <div className="space-y-4">
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors">
                Change Password
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Password changes coming soon
              </p>
            </div>
          </div>
          
          {/* Discord Integration */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-dark dark:text-light mb-4">
              Discord Integration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-dark dark:text-light font-medium">Discord Bot</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Link your Discord account to create events via bot commands
                  </p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    signOut();
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}