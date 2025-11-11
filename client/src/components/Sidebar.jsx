import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import assets from '../assets/assets';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  const activeUsers = users.filter((user) => onlineUsers.includes(user._id));

  return (
    <div className="bg-white h-full flex flex-col p-4 w-full max-w-[300px]">
      {/* --- Header: Logo & Menu --- */}
      <div className="flex flex-col flex-shrink-0 pb-2">
        <div className="flex justify-between items-center mb-2">
          {/* Logo */}
          <img src={assets.logo} alt="MsgIn Logo" className="w-20 object-contain" />

          {/* Menu Dropdown */}
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer filter brightness-0"
            />
            <div className="absolute top-full right-0 z-20 w-36 p-3 rounded-md bg-white border border-gray-200 text-gray-800 shadow-xl hidden group-hover:block">
              <p
                onClick={() => navigate('/profile')}
                className="cursor-pointer text-sm py-1 px-2 rounded hover:bg-gray-100"
              >
                Edit Profile
              </p>
              <hr className="my-1 border-t border-gray-200" />
              <p
                onClick={() => logout()}
                className="cursor-pointer text-sm py-1 px-2 rounded hover:bg-gray-100 text-red-500"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Active Users Horizontal Scroll --- */}
      <div className="mt-1">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
          Active Users
        </p>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {activeUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className="relative flex-shrink-0 cursor-pointer"
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="mt-3 mb-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <img src={assets.search_icon} alt="search" className="w-4 opacity-50 mr-2" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search or start new chat"
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>

      {/* --- All Chats Header --- */}
      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
        All Chats
      </p>

      {/* --- All Chats Scrollable List --- */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                selectedUser?._id === user._id
                  ? 'bg-gray-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="font-semibold text-gray-900 truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user.bio || 'Say hello!'}
                </p>
              </div>

              {unseenMessages[user._id] > 0 && (
                <div className="flex-shrink-0 text-xs">
                  <p className="h-5 w-5 flex justify-center items-center rounded-full bg-green-500 text-white font-medium">
                    {unseenMessages[user._id]}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400 mt-5 text-center">
            {input ? 'No users match your search.' : 'Loading users...'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
