import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // 1. Check Authentication Status on Initial Load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${backendUrl}/api/auth/check-auth`, {
          headers: { token },
        });
        if (res.data.success) {
          setAuthUser(res.data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
      }
    };
    checkAuth();
  }, [backendUrl]);

  // 2. Setup Socket.io Connection when User Logs In
  useEffect(() => {
    if (authUser) {
      const newSocket = io(backendUrl, {
        query: { userId: authUser._id },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => newSocket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, backendUrl]);

  // 3. Handle Login and Sign Up
  const login = async (state, data) => {
    try {
      const endpoint = state === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(`${backendUrl}${endpoint}`, data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setAuthUser(res.data.user);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  // 4. Handle Logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    toast.success("Logged out successfully");
  };

  // 5. Handle Profile Updates
  const updateProfile = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${backendUrl}/api/auth/update-profile`, data, {
        headers: { token },
      });

      if (res.data.success) {
        setAuthUser(res.data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};