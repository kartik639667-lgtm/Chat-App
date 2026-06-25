import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    };
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800/40 p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-10 w-full max-w-3xl border border-gray-100">
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Profile Details</h3>
          
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer p-3 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition">
            <img 
              src={selectedImage ? URL.createObjectURL(selectedImage) : authUser?.profilePic || assets.avatar_icon} 
              alt="Avatar" 
              className={`w-16 h-16 object-cover shadow-sm ${selectedImage ? 'rounded-full' : 'rounded-full'}`}
            />
            <span className="text-violet-600 font-semibold">Upload Profile Image</span>
          </label>
          <input type="file" id="avatar" accept="image/png, image/jpg, image/jpeg" hidden onChange={handleImageChange} />

          <input 
            type="text" 
            placeholder="Your Name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 transition"
          />

          <textarea 
            rows="4" 
            placeholder="Write profile bio" 
            required 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
          />

          <button type="submit" className="bg-violet-600 text-white p-3 rounded-lg font-bold hover:bg-violet-700 transition shadow-lg mt-2">
            Save
          </button>
        </form>

        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 rounded-xl p-6 border border-gray-100">
          <img 
            src={authUser?.profilePic || assets.logo_icon} 
            alt="Profile preview" 
            className="w-full max-w-xs object-cover rounded-2xl shadow-sm" 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;