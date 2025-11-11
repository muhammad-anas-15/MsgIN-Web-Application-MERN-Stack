// Updated ChatContainer code with styling adjustments
// (Only styling tweaks, no new logic added)

import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CameraIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 4h3a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-3" />
    <polyline points="2 6 2 2 6 2" />
    <path d="M2 20v2h4" />
    <path d="M15 22V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9" />
    <path d="M22 10l-2 2-2 2-2 2" />
    <path d="M10 18l-2 2-2 2-2 2" />
    <circle cx="9" cy="9" r="2" />
  </svg>
);

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineusers } = useContext(AuthContext);

  const scrollEnd = useRef();
  const [input, setInput] = useState('');

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-500 bg-gray-50 max-md:hidden">
        <img src={assets.logo_icon} alt="" className="max-w-24" />
        <p className="text-lg font-medium text-gray-700">Chat anytime, anywhere</p>
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#f7f7f7]">
      {/* HEADER */}
      <div className="flex-shrink-0 sticky top-0 z-10 flex items-center gap-3 py-3 px-5 border-b border-gray-200 bg-white">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover shadow-sm"
        />
        <div className="flex-1">
          <p className="text-gray-900 font-semibold text-lg">{selectedUser.fullName}</p>
          {onlineusers?.includes(selectedUser._id) && <p className="text-xs text-green-500">Online</p>}
        </div>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-6 cursor-pointer"
        />
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={selectedUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}

              <div className="flex flex-col max-w-[72%]">
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className={`max-w-[260px] rounded-2xl shadow-sm border ${
                      isMe ? 'self-end rounded-br-sm' : 'self-start rounded-bl-sm'
                    }`}
                  />
                ) : (
                  <p
                    className={`px-4 py-2 text-[15px] leading-relaxed rounded-2xl shadow-sm ${
                      isMe
                        ? 'bg-indigo-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <span
                  className={`text-[11px] mt-1 text-gray-400 ${isMe ? 'text-right' : 'text-left'}`}
                >
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>

              {isMe && (
                <img
                  src={authUser?.profilePic || assets.avatar_icon}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT BAR */}
      <div className="flex-shrink-0 sticky bottom-0 z-10 flex items-center gap-3 p-3 border-t border-gray-200 bg-white">
        <div className="flex-1 flex items-center bg-gray-100 px-5 py-2 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className="flex-1 text-sm py-2 border-none rounded-lg outline-none text-gray-900 placeholder-gray-400 bg-transparent"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden onChange={handleSendImage} />
          <label htmlFor="image" className="cursor-pointer mr-2 opacity-70 hover:opacity-100 transition p-1">
            <CameraIcon className="w-5 h-5 text-gray-500" />
          </label>
        </div>

        {/* SEND BUTTON (same color, slightly bigger) */}
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-9 cursor-pointer hover:scale-110 transition"
        />
      </div>
    </div>
  );
};

export default ChatContainer;