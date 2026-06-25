import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);
  const [messageImages, setMessageImages] = useState([]);

  useEffect(() => {
    // Extract all images from the current chat messages
    const images = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
    setMessageImages(images);
  }, [messages]);

  return (
    <div className="hidden lg:flex flex-col bg-white overflow-y-auto">
      <div className="p-6 flex flex-col items-center border-b text-center">
        <div className="relative mb-4">
          <img 
            src={selectedUser.profilePic || assets.avatar_icon} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white" 
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></span>
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{selectedUser.fullName}</h2>
        <p className="text-sm text-gray-500 mb-4">{onlineUsers.includes(selectedUser._id) ? 'Active Now' : 'Offline'}</p>
        {selectedUser.bio && (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl w-full">{selectedUser.bio}</p>
        )}
      </div>

      <div className="p-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Shared Media ({messageImages.length})</h3>
        {messageImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {messageImages.map((imgUrl, index) => (
              <img 
                key={index} 
                src={imgUrl} 
                alt="Shared Media" 
                className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open(imgUrl, '_blank')}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center mt-10">No media shared yet.</p>
        )}
        
        <button 
          onClick={logout} 
          className="w-full mt-8 bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600 transition shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;