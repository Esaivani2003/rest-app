import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import BgImage from "../../public/download (1).jpg";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      console.log("Signing up", name, email, password);
    } else {
      console.log("Logging in", email, password);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#99BC85]">
      {/* Background Image Section */}
      <div className="hidden md:block md:w-[50%] h-screen">
        <Image
          src={BgImage}
          alt="Background"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Login Form Section */}
      <div className="flex justify-center items-center w-full md:w-[50%] p-8">
        <div className="w-full max-w-sm p-8 space-y-6 rounded-xl bg-black bg-opacity-30 shadow-xl backdrop-blur-lg border border-white border-opacity-20">
          <h1 className="text-3xl font-bold text-center text-white tracking-wide">
            {isSignUp ? "Sign Up" : "Login"}
          </h1>
          <form noValidate className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="space-y-2 text-sm">
                <label htmlFor="name" className="block text-white font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-white border-opacity-40 rounded-md bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  required
                />
              </div>
            )}
            <div className="space-y-2 text-sm">
              <label htmlFor="email" className="block text-white font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-white border-opacity-40 rounded-md bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-2 text-sm">
              <label htmlFor="password" className="block text-white font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-white border-opacity-40 rounded-md bg-transparent text-white placeholder-gray-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                required
              />
            </div>
            
            <button onClick={()=> router.push("/article")} className="w-full py-3 font-semibold rounded-md bg-violet-600 text-white hover:bg-violet-700 transition duration-300 ease-in-out">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <p className={`text-sm ${!isUser && 'hidden'} text-center text-gray-300`}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {isUser && setIsSignUp(!isSignUp)}}
              className="underline text-violet-400 hover:text-violet-500 transition"
            >
              {isSignUp ? "Sign in" :isUser?"Sign up":"Sign in" }
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
