"use client";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();
  
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  // Debug authentication state
  console.log("🔐 Auth State:", { isAuthenticated, isLoading });
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/calendar" replace /> : <LoginPage />
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/calendar" 
        element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/calendar" : "/login"} replace />
        } 
      />
      
      {/* Catch all - redirect to appropriate page */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/calendar" : "/login"} replace />
        } 
      />
    </Routes>
  );
}