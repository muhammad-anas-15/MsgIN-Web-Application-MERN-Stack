import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Profilepage = () => {

  // add functionality for edit profile after db managment

  const {authUser, updateProfile} = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!selectedImg)
    {
      // api calling
      await updateProfile({fullName: name, bio});
      navigate('/');
      return;
    }

    // logic made for db managament for edit profile.

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async ()=>{
      const base64Image = reader.result;
      await updateProfile({profilePic: base64Image
        , fullName: name, bio });
      navigate('/');
    }
  }

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 overflow-hidden">
      
      {/* --- 🔵 Blurred Decorative Shapes in Background --- */}
      <div className="absolute w-[500px] h-[500px] bg-purple-300/40 rounded-full blur-3xl top-[-150px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-300/40 rounded-full blur-3xl bottom-[-100px] right-[-80px] animate-pulse delay-200"></div>
      <div className="absolute w-[250px] h-[250px] bg-indigo-300/40 rounded-full blur-2xl bottom-[20%] left-[10%] animate-bounce-slow"></div>

      {/* --- Main Glass Card --- */}
      <div className="relative z-10 w-11/12 max-w-3xl bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl flex items-center gap-10 p-10 max-sm:flex-col max-sm:p-6 max-sm:gap-6">
        
        {/* Left Side - Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Personalize Your Profile ✨</h3>
          
          {/* Avatar Upload */}
          <label htmlFor="avatar" className="flex items-center gap-4 cursor-pointer group">
            <input onChange={(e) => setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
            
              <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="Profile" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />

              Upload profile Image
          </label>

          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-medium">Full Name</label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              required
              placeholder="Enter your name"
              className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Bio Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-700 font-medium">Bio</label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="Write a short bio"
              required
              rows={4}
              className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform font-medium"
>
            Save Changes
          </button>
        </form>

        {/* Right Side - Logo / Preview */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-gradient-to-br from-purple-100 to-pink-50 rounded-full p-8 shadow-inner">
            <img
              className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="Logo"/>
          </div>
          <p className="text-gray-600 text-sm mt-4 italic">
            “A fresh look makes chatting more fun!” 🌸
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profilepage
