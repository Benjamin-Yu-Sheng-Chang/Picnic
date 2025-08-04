import { useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect } from "react";
import Calendar from "../Calendar";

export default function CalendarPage() {
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
              Picnic Calendar
            </h1>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              ✅ Signed In
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/calendar")}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Calendar
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
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
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark dark:text-light mb-2">
            Your Events
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your schedule and upcoming events
          </p>
        </div>
        
        <Calendar />
      </main>
    </div>
  );
}