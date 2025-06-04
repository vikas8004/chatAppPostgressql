import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance.jsx";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({
  authUser: null,
  isRegistering: false,
  isLogging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  socket: null,
  onlineUsers: [],
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("auth/checkauth");
      // console.log(res.data);
      set({ authUser: res.data.data, isCheckingAuth: false });
      get().connectSocket();
    } catch (error) {
      console.error(error);
      set({ isCheckingAuth: false });
    }
  },
  register: async (formData) => {
    try {
      set({ isRegistering: true });
      const res = await axiosInstance.post("/auth/signup", formData);
      return res.data;
    } catch (error) {
      throw error; // Re-throw the error to handle it in the component

    }
    finally {
      set({ isRegistering: false });
    }

  },
  login: async (formData) => {
    try {
      set({ isLogging: true });
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data.data });
      get().connectSocket();
      return res.data.data;
    } catch (error) {
      throw error; // Re-throw the error to handle it in the component
    } finally {
      set({ isLogging: false });
    }
  },
  logout: async () => {
    try {
      set({ isLoggingOut: true });
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful!");
      get().disConnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
    finally {
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (formData) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/profile", formData);
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully!");
      return res.data.data;
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.response?.data?.error || "Profile update failed. Please try again.");
      throw error; // Re-throw the error to handle it in the component
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(import.meta.env.VITE_BASE_URL, {
      query: {
        user_id: authUser.id
      }
    });
    socket.connect();
    // console.log("Socket connected:", socket);

    set({ socket });
    // Subscribe to online users event
    socket.on("getOnlineUsers", (onlineUsers) => {
      // console.log("Online users:", onlineUsers);
      set({ onlineUsers });
    });

  },
  disConnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));
