import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);
  const [input, setInput] = useState('');

  // FIX: getUsers is now stable (useCallback in ChatContext) so no infinite loop
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
  };

  return (
    <div className={`flex flex-col bg-white border-r ${selectedUser ? 'hidden lg:flex' : 'flex'}`}>
      {/* Header / Search */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <img src={assets.logo} alt="Logo" className="w-10" />
          <div className="relative group cursor-pointer">
            <img src={assets.menu_icon} alt="Menu" className="w-5" />
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-lg border w-32 overflow-hidden z-10">
              <p className="p-3 text-sm hover:bg-gray-100 cursor-pointer">Edit Profile</p>
              <hr />
              <p onClick={logout} className="p-3 text-sm hover:bg-gray-100 cursor-pointer text-red-500">Logout</p>
            </div>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <img src={assets.search_icon} alt="Search" className="w-4 h-4 mr-2 opacity-50" />
          <input
            type="text"
            placeholder="Search user..."
            className="bg-transparent outline-none w-full text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`flex items-center p-3 mb-2 cursor-pointer rounded-xl transition ${
              selectedUser?._id === user._id ? 'bg-violet-50 border-violet-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || assets.avatar_icon}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-semibold text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500">{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</p>
            </div>
            {unseenMessages[user._id] > 0 && (
              <div className="bg-violet-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;