import React, { useState, useEffect, useContext } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  // Extract all images from messages
  useEffect(() => {
    setMsgImages(messages.filter(msg => msg.image).map(msg => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="bg-white text-gray-800 w-full md:w-[300px] flex flex-col h-full border-l border-gray-200">
      {/* PROFILE SECTION - Sticky Header */}
      <div className="flex-shrink-0 sticky top-0 z-10 flex flex-col items-center gap-2 pt-10 pb-6 bg-white">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-purple-500"
        />
        <h1 className="text-xl font-bold flex items-center gap-2 mt-2">
          {selectedUser.fullName}
        </h1>
        {onlineUsers.includes(selectedUser._id) ? (
          <span className="text-sm text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </span>
        ) : (
          <span className="text-sm text-gray-400 font-medium">Offline</span>
        )}
        <p className="text-sm text-gray-500 text-center px-4 mt-3 border-t border-gray-100 pt-4">
          {selectedUser.bio || 'Hi, I am using MsGin'}
        </p>
      </div>

      {/* MEDIA SECTION - Scrollable */}
      <div className="flex-1 px-5 py-4 overflow-y-auto">
        <p className="text-base font-semibold mb-3 text-gray-700 border-b pb-2">
            Media Shared ({msgImages.length})
        </p>
        <div className="grid grid-cols-2 gap-3">
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:scale-[1.02] transition-transform"
              >
                <img src={url} alt={`Media ${index}`} className="w-full h-24 object-cover" />
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 col-span-2 text-center py-5">
                No shared media found.
            </p>
          )}
        </div>
        
        {/* Added some padding to the bottom of the scrollable area */}
        <div className="h-5"></div> 

      </div>

      {/* LOGOUT BUTTON - Sticky Footer */}
      <div className="flex-shrink-0 sticky bottom-0 p-4 border-t border-gray-100 bg-white">
        <button
          onClick={() => logout()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium py-2 rounded-full shadow hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;