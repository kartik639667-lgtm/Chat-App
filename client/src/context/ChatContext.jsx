import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  // FIX: Added unseenMessages — Sidebar was already using this but it was never defined here
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // FIX: useCallback makes getUsers stable so Sidebar's useEffect doesn't loop infinitely
  const getUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/api/messages/users`, {
        headers: { token },
      });
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load users');
    } finally {
      setIsUsersLoading(false);
    }
  }, [backendUrl]);

  const getMessages = useCallback(async (userId) => {
    setIsMessagesLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${backendUrl}/api/messages/${userId}`, {
        headers: { token },
      });
      setMessages(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load messages');
    } finally {
      setIsMessagesLoading(false);
    }
  }, [backendUrl]);

  // FIX: Load messages whenever the selected user changes
  // Previously getMessages was never called, so the chat was always empty
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser, getMessages]);

  const sendMessage = async (messageData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${backendUrl}/api/messages/send/${selectedUser._id}`,
        messageData,
        { headers: { token } }
      );
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const subscribeToMessages = useCallback(() => {
    if (!selectedUser || !socket) return;

    socket.on('newMessage', (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        // FIX: Messages from other users now increment unseen count instead of being dropped
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  }, [selectedUser, socket]);

  const unsubscribeFromMessages = useCallback(() => {
    if (socket) socket.off('newMessage');
  }, [socket]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [subscribeToMessages, unsubscribeFromMessages]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        unseenMessages,
        setUnseenMessages,
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