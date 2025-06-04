import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { useAuthStore } from './store/useAuthStore.jsx';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';




const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  useEffect(() => {
    checkAuth();
    setTheme(localStorage.getItem("theme") || "light");
  }, [checkAuth]);

  // console.log("Auth User:", authUser);

  if (isCheckingAuth && !authUser) {
    return <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>

  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Toaster position='top-center' toastOptions={{ duration: 3000, }} />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to={"/"} />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to={"/"} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to={"/login"} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App; 