import loginImage from "../assets/loginImage.jpg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Include cookies in the request
        },
      );

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/"); //TODO redirect to right page are Signin in
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Signin failed:", error);
      alert("Signin failed");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Side */}
      <div className="relative w-1/2 overflow-hidden shadow-[5px_0_18px_rgba(0,0,0,0.3)]">
        <img
          src={loginImage}
          alt="Shopping bag"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form Side */}
      <div className="flex w-1/2 flex-col items-center justify-center p-8">
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">Welcome!</h2>

        <div className="w-full max-w-md">
          
          <form onSubmit={handleSignin} className="space-y-4">
            <div>
              <label htmlFor="Email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="username"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
              Password
              </label>
              <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#3a5b22] px-4 py-3 font-semibold text-white transition hover:bg-[#034605]"
            >
              Sign in
            </button>
          </form>
            
            {/* Add spacing */}
            <div className="mt-10"></div>
            
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
            <a
            href="/register"
            className="text-blue-600 underline"
            >
            Sign Up
            </a>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;