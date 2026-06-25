import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (currentState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    const state = currentState === 'Sign Up' ? 'signup' : 'login';
    await login(state, { fullName, email, password, bio });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="flex w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Left Side (Visual Graphic) */}
        <div className="hidden md:flex w-1/2 bg-slate-50 items-center justify-center p-10 border-r">
          <img src={assets.logo_big} alt="Logo" className="w-2/3 object-contain" />
        </div>
        
        {/* Right Side (Form) */}
        <form onSubmit={onSubmitHandler} className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">{currentState}</h2>
            {isDataSubmitted && currentState === 'Sign Up' && (
              <img 
                src={assets.add_icon} 
                className="w-6 cursor-pointer md:hidden max-w-7 rotate-180" 
                onClick={() => setIsDataSubmitted(false)} 
                alt="back" 
              />
            )}
          </div>

          {currentState === 'Sign Up' && !isDataSubmitted && (
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-sm placeholder-gray-400 flex-1"
            />
          )}

          {!isDataSubmitted && (
            <>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-sm placeholder-gray-400 flex-1"
              />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-sm placeholder-gray-400 flex-1"
              />
            </>
          )}

          {currentState === 'Sign Up' && isDataSubmitted && (
            <textarea 
              rows="4" 
              placeholder="Provide a short bio" 
              required 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 bg-transparent text-sm placeholder-gray-400 flex-1"
            />
          )}

          <button type="submit" className="bg-violet-600 text-white p-3 rounded-lg font-medium hover:bg-violet-700 transition duration-200 shadow-md">
            {currentState === 'Sign Up' ? 'Create Account' : 'Login Now'}
          </button>

          <div className="mt-6 text-sm text-gray-600 flex items-start gap-2">
            <input type="checkbox" required className="cursor-pointer mt-1" />
            <p className="text-xs">I agree to the terms of service & privacy policy.</p>
          </div>

          <div className="mt-4 text-sm">
            {currentState === 'Sign Up' ? (
              <p className="text-gray-600">Already have an account? <span onClick={() => {setCurrentState('Login'); setIsDataSubmitted(false);}} className="text-violet-600 font-medium cursor-pointer hover:underline">Login here</span></p>
            ) : (
              <p className="text-gray-600">Don't have an account? <span onClick={() => setCurrentState('Sign Up')} className="text-violet-600 font-medium cursor-pointer hover:underline">Click here</span></p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;