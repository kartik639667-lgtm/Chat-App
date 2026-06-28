import { useContext, useState, useEffect, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { selectedUser, setSelectedUser, messages, sendMessage, isMessagesLoading } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return toast.error('Select an image file');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
  };

  if (!selectedUser) {
    return (
      <div
        className="hidden md:flex flex-col items-center justify-center h-full"
        style={{ background: '#F8F9FB' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4"
          style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}
        >
          💬
        </div>
        <p className="text-lg font-semibold text-gray-700">Your messages</p>
        <p className="text-sm text-gray-400 mt-1">Select a chat to start messaging</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex flex-col h-full" style={{ background: '#F8F9FB' }}>

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b border-gray-200"
        style={{ background: '#FFFFFF' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>

          <div className="relative">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: '2px solid #6C63FF33' }}
              alt="Avatar"
            />
            {isOnline && (
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{ background: '#22C55E' }}
              />
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-800 text-sm">{selectedUser.fullName}</p>
            <p className="text-xs" style={{ color: isOnline ? '#22C55E' : '#9CA3AF' }}>
              {isOnline ? '● Online' : '○ Offline'}
            </p>
          </div>
        </div>

        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: '#6C63FF', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-sm">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === authUser._id;
            return (
              <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] flex gap-2 items-end ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={
                      isOwn
                        ? authUser.profilePic || assets.avatar_icon
                        : selectedUser.profilePic || assets.avatar_icon
                    }
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    alt="Avatar"
                  />
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div
                      className="px-4 py-2.5 rounded-2xl text-sm"
                      style={
                        isOwn
                          ? {
                              background: 'linear-gradient(135deg, #6C63FF, #8B85FF)',
                              color: '#FFFFFF',
                              borderBottomRightRadius: '4px',
                            }
                          : {
                              background: '#FFFFFF',
                              color: '#1F2937',
                              border: '1px solid #E5E7EB',
                              borderBottomLeftRadius: '4px',
                            }
                      }
                    >
                      {msg.image && (
                        <img src={msg.image} alt="Attachment" className="max-w-[200px] rounded-lg mb-2" />
                      )}
                      {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-gray-200" style={{ background: '#FFFFFF' }}>
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 rounded-2xl px-4 py-2"
          style={{ background: '#F0F1F5' }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <label htmlFor="image-upload" className="cursor-pointer flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="hover:stroke-indigo-400 transition">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/png, image/jpg, image/jpeg"
            hidden
            onChange={handleSendImage}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 transition-all"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #6C63FF, #3ECFCF)'
                : '#E5E7EB',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;