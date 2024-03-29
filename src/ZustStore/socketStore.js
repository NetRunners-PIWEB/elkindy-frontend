import { create } from "zustand";
import io from "socket.io-client";
import axios from "axios";
const useSocketStore = create((set) => ({
  socket: null,
  onlineUsers: [],
  initializeSocket: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(
      "http://localhost:3000/api/auth/validateSession",
      config
    );
    if (response.data.user?._id) {
      console.log("true");
      const socket = io("http://localhost:5000", {
        query: {
          userId: response.data.user._id,
        },
      });
      set({ socket });
      console.log(socket);
      return () => socket && socket.close();
    }
  },
}));

export default useSocketStore;
