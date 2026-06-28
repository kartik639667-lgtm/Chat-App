import { useContext, useState, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';
import EditProfileModal from './EditProfileModal';

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { onlineUsers, logout } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    if (menuOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  const filteredUsers = input
    ? users.filter((user) => user.fullName.toLowerCase().includes(input.toLowerCase()))
    : users;

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
  };

  return (
    <div
      className={`flex flex-col border-r border-gray-200 ${selectedUser ? 'hidden lg:flex' : 'flex'}`}
      style={{ background: '#F8F9FB', minWidth: '280px' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-200" style={{ background: '#FFFFFF' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}
            >
              C
            </div>
            <span className="font-semibold text-gray-800 text-base tracking-tight">ChatApp</span>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{
                background: menuOpen ? '#EDEDF8' : 'transparent',
                color: '#6C63FF',
              }}
              title="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                style={{ background: '#FFFFFF', minWidth: '150px' }}
              >
                {/* ✅ Fixed: now opens the modal */}
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { setMenuOpen(false); setShowEditProfile(true); }}
                >
                  ✏️ Edit Profile
                </button>
                <div className="border-t border-gray-100" />
                <button
                  className="w-full text-left px-4 py-3 text-sm transition-colors"
                  style={{ color: '#EF4444' }}
                  onClick={() => { setMenuOpen(false); logout(); }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center rounded-xl px-3 py-2 gap-2"
          style={{ background: '#F0F1F5' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4 pb-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Messages</p>
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);
            const unseen = unseenMessages[user._id] || 0;

            return (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="flex items-center p-3 mb-1 cursor-pointer rounded-xl transition-all"
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #6C63FF18, #3ECFCF18)'
                    : 'transparent',
                  border: isSelected ? '1px solid #6C63FF22' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#EEEEF8';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || assets.avatar_icon}
                    alt={user.fullName}
                    className="w-11 h-11 rounded-full object-cover"
                    style={{ border: isSelected ? '2px solid #6C63FF' : '2px solid #E5E7EB' }}
                  />
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: '#22C55E' }}
                    />
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: isSelected ? '#6C63FF' : '#1F2937' }}
                  >
                    {user.fullName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: isOnline ? '#22C55E' : '#9CA3AF' }}>
                    {isOnline ? '● Online' : '○ Offline'}
                  </p>
                </div>

                {unseen > 0 && (
                  <div
                    className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{ background: '#6C63FF' }}
                  >
                    {unseen}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ✅ Edit Profile Modal */}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
    </div>
  );
};

export default Sidebar;