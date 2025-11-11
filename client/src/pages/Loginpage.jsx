import React, { useState } from "react";
import assets from "../assets/assets";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Loginpage = () => {
  const [currState, setcurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isDataSubmitted && currState === "Sign up") 
    {
      setIsDataSubmitted(true);
    } 
    else 
    {
      await login( currState === "Sign up" ? 'signup' : 'login', { fullName, email, password, bio });
      // API call logic here
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-100 overflow-hidden p-4">
      
      {/* --- Background Blobs for Creativity --- */}
      <div className="absolute w-[500px] h-[500px] bg-purple-300/40 rounded-full blur-3xl top-[-150px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-300/40 rounded-full blur-3xl bottom-[-100px] right-[-80px] animate-pulse delay-200"></div>
      <div className="absolute w-[250px] h-[250px] bg-indigo-300/40 rounded-full blur-2xl bottom-[20%] left-[10%] animate-bounce-slow"></div>

      {/* --- Main Container --- */}
      <div className="relative z-10 flex items-center gap-12 max-sm:flex-col max-sm:gap-6">
        {/* --------- Left (Logo) --------- */}
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-br from-purple-100 to-pink-50 rounded-full p-8 shadow-inner">
            <img
              src={assets.logo_big}
              alt="Logo"
              className="w-[min(30vw,250px)] max-sm:w-40 drop-shadow-xl"
            />
          </div>
          <p className="mt-4 text-gray-600 italic text-sm">
            “Connect. Chat. Create memories.” 💬
          </p>
        </div>

        {/* ---------- Right (Form) ---------- */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-8 flex flex-col gap-6 shadow-2xl w-[350px] max-sm:w-full"
        >
          {/* Header */}
          <h2 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex justify-between items-center">
            {currState}
            {isDataSubmitted && (
              <img
                src={assets.arrow_icon}
                alt="Back"
                className="w-5 cursor-pointer hover:scale-110 transition"
                onClick={() => setIsDataSubmitted(false)}
              />
            )}
          </h2>

          {/* Full Name (only first step of sign up) */}
          {currState === "Sign up" && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              placeholder="Full Name"
              required
              className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}

          {/* Email & Password */}
          {!isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email Address"
                required
                className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </>
          )}

          {/* Bio (after step 1) */}
          {currState === "Sign up" && isDataSubmitted && (
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              placeholder="Tell us something about yourself..."
              required
              className="p-3 bg-white/60 border border-purple-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            ></textarea>
          )}

          {/* Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform font-medium"
          >
            {currState === "Sign up" && !isDataSubmitted
              ? "Continue"
              : currState === "Sign up"
              ? "Create Account"
              : "Login Now"}
          </button>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" className="accent-violet-500" required />
            <p>I agree to the terms of use & privacy policy.</p>
          </div>

          {/* Switch State */}
          <div className="text-sm text-gray-700">
            {currState === "Sign up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setcurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-indigo-600 cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p>
                Create an account{" "}
                <span
                  onClick={() => setcurrState("Sign up")}
                  className="font-medium text-indigo-600 cursor-pointer hover:underline"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Loginpage;
