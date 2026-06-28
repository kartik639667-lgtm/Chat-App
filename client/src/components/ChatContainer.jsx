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
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-slate-50 border-r">
        <img src={assets.logo_icon} alt="Logo" className="w-24 mb-4 opacity-50" />
        <p className="text-xl text-gray-400 font-medium">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm z-10">
        <div className="flex items-center gap-3">
          <img
            src={assets.arrow_icon}
            onClick={() => setSelectedUser(null)}
            className="w-6 cursor-pointer md:hidden rotate-180"
            alt="Back"
          />
          <img
            src={selectedUser.profilePic || assets.avatar_icon}
            className="w-10 h-10 rounded-full object-cover"
            alt="Avatar"
          />
          <div>
            <p className="font-bold text-gray-800 flex items-center gap-2">
              {selectedUser.fullName}
              {onlineUsers.includes(selectedUser._id) && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </p>
          </div>
        </div>
        <img src={assets.info_icon} alt="Info" className="w-6 cursor-pointer opacity-70" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {isMessagesLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-sm">Loading messages...</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.senderId === authUser._id;
            return (
              <div key={index} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={
                      isOwn
                        ? authUser.profilePic || assets.avatar_icon
                        : selectedUser.profilePic || assets.avatar_icon
                    }
                    className="w-8 h-8 rounded-full object-cover self-end mb-1"
                    alt="Avatar"
                  />
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl ${
                        isOwn
                          ? 'bg-violet-600 text-white rounded-br-none'
                          : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.image && (
                        <img src={msg.image} alt="Attachment" className="max-w-[200px] rounded-lg mb-2" />
                      )}
                      {msg.text && <p className="text-sm">{msg.text}</p>}
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
        <div ref={scrollRef}></div>
      </div>

      {/* Bottom Input Area */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-gray-100 p-2 px-4 rounded-full">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-transparent outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <img src={assets.gallery_icon} alt="Gallery" className="w-5 hover:opacity-70 transition" />
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
            className="bg-violet-600 p-2 rounded-full hover:bg-violet-700 transition flex-shrink-0"
          >
            <img src={assets.send_icon} alt="Send" className="w-4 h-4 invert" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;