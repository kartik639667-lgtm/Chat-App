import { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const EditProfileModal = ({ onClose }) => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [fullName, setFullName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');
  const [previewPic, setPreviewPic] = useState(authUser?.profilePic || null);
  const [picBase64, setPicBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewPic(reader.result);
      setPicBase64(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({
      fullName,
      bio,
      ...(picBase64 && { profilePic: picBase64 }),
    });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-6"
        style={{ background: '#FFFFFF' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={previewPic || assets.avatar_icon}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: '3px solid #6C63FF33' }}
              />
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow"
                style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)' }}
              >
                ✏️
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
            <p className="text-xs text-gray-400">Click pencil to change photo</p>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="px-4 py-2.5 rounded-xl text-sm text-gray-700 outline-none border border-gray-200 focus:border-indigo-400 transition"
              style={{ background: '#F8F9FB' }}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
              className="px-4 py-2.5 rounded-xl text-sm text-gray-700 outline-none border border-gray-200 focus:border-indigo-400 transition resize-none"
              style={{ background: '#F8F9FB' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition"
              style={{ background: 'linear-gradient(135deg, #6C63FF, #3ECFCF)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;