import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  // Grab the socket connection established in AuthContext
  const { socket } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // 1. Fetch all users for the left sidebar
  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/messages/users`, {
        headers: { token },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setIsUsersLoading(false);
    }
  };

  // 2. Fetch the chat history for the currently selected user
  const getMessages = async (userId) => {
    setIsMessagesLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/messages/${userId}`, {
        headers: { token },
      });
      setMessages(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // 3. Send a new text or image message
  const sendMessage = async (messageData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${backendUrl}/api/messages/send/${selectedUser._id}`,
        messageData,
        { headers: { token } }
      );
      
      // Instantly add the sent message to the UI without refreshing
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  // 4. Real-time Socket Listener for Incoming Messages
  const subscribeToMessages = () => {
    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      // Only append the message if it is from the person we are actively chatting with
      if (newMessage.senderId !== selectedUser._id) return;
      setMessages((prev) => [...prev, newMessage]);
    });
  };

  // 5. Cleanup Listener
  const unsubscribeFromMessages = () => {
    if (!socket) return;
    socket.off("newMessage");
  };

  // Run the socket subscription whenever the selected user changes
  useEffect(() => {
    subscribeToMessages();
    
    // Cleanup function when component unmounts or user changes
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};