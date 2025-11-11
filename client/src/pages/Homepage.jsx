import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/ChatContext';

const Homepage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    // Outer container: Light background and full screen size
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {/* Main Chat Window Container: White background, rounded corners, shadow */}
      <div className="h-full w-full max-w-[1400px] max-h-[900px] flex overflow-hidden bg-white rounded-xl shadow-2xl">
        
        {/* Left Sidebar: Fixed width, full height */}
        <div className="w-[300px] flex flex-col h-full flex-shrink-0">
          <Sidebar />
        </div>

        {/* Middle Chat Section: Takes remaining space */}
        <div className="flex-1 flex flex-col h-full border-l border-r border-gray-100">
          <ChatContainer />
        </div>

        {/* Right Sidebar (visible only if a user is selected): Fixed width */}
        {selectedUser && (
          <div className="w-[300px] flex flex-col h-full flex-shrink-0">
            <RightSidebar />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Homepage;
