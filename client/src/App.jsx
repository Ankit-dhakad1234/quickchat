import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import { assets } from "./assets/assets.js";

const App = () => {
  const { authUser, loading } = useContext(AuthContext);

  return (
    <div className="relative min-h-screen bg-[url('/bgImage.svg')] bg-contain">
      <Toaster />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 p-6 bg-slate-900/95 border border-violet-500 rounded-3xl shadow-xl">
            <div className="h-16 w-16 rounded-full border-4 border-violet-400 border-t-transparent animate-spin"></div>
            <p className="text-white text-sm">Please wait while we process your request...</p>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
