import { useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import BgImage from "../../public/loginpic.jpg";
import toast, { Toaster } from "react-hot-toast";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isUser, setIsUser] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      toast("Sign Up logic not implemented yet", { icon: "🛠️" });
      setLoading(false);
    } else {
      try {
        const res = await fetch("https://rest-app-three.vercel.app/api/usersRoute/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();

        const { token, user } = data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    
        console.log("Login success:", data);
        // localStorage.setItem("token", data.token); // Uncomment to store token

        toast.success("Login successful 🎉");
        setTimeout(() => router.push("/article"), 1000); // slight delay to show toast
      } catch (error) {
        toast.error("Invalid email or password ❌");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-br from-white via-green-100 to-green-300">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Image */}
      <div className="hidden md:block md:w-[50%] h-screen relative">
        <Image
          src={BgImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center w-full md:w-[50%] p-6 md:p-12">
        <div className="w-full max-w-sm p-8 space-y-6 rounded-2xl shadow-2xl backdrop-blur-md bg-white/70 border border-black/10 text-black">
          <h1 className="text-3xl font-bold text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          <form noValidate className="space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="space-y-1">
                <label htmlFor="name" className="block font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 font-semibold rounded-md ${
                loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } text-white transition duration-300`}
            >
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => isUser && setIsSignUp(!isSignUp)}
              className="underline text-green-700 hover:text-green-800 transition"
            >
              {isSignUp ? "Sign in" : isUser ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
