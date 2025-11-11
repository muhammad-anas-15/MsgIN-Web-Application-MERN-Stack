import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("✅ Frontend using backend URL:", backendUrl);

// Set base URL for Axios
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true; // if you are using cookies

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // -------------------------
  // Axios Interceptor: Attach token to all requests
  // -------------------------
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // -------------------------
  // Check Auth
  // -------------------------
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("checkAuth error:", error.response?.data || error.message);
      setAuthUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // -------------------------
  // Login
  // -------------------------
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        localStorage.setItem("token", data.token); // save token
        setAuthUser(data.userData);
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -------------------------
  // Logout
  // -------------------------
  const logout = async () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setOnlineUsers([]);
    if (socket) socket.disconnect();
    toast.success("Logged out successfully");
  };

  // -------------------------
  // Update Profile
  // -------------------------
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.userData);
        toast.success("Profile updated successfully");
      }else {
        // Handle explicit backend failure (if success is false)
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // -------------------------
  // Connect Socket
  // -------------------------
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    
    //Pass the JWT token for socket authentication
    const token = localStorage.getItem("token")

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      
      // Pass token in the 'auth' object for the server to verify the user
      auth: { token: token } 
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  // -------------------------
  // Context Value
  // -------------------------
  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
