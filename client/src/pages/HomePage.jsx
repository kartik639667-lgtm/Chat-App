import { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../context/ChatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="border w-full h-screen p-4 sm:p-10">
      <div 
        className={`grid ${
          selectedUser ? 'grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]' : 'grid-cols-1 md:grid-cols-[1fr_2fr]'
        } h-full bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border border-white/20`}
      >
        <Sidebar />
        <ChatContainer />
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;