import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerImage from "../assets/loginImage.jpg";

export default function Register() {
  const [full_name, setFull_Name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [verificationAnswer, setVerificationAnswer] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const [question] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, correctAnswer: num1 + num2 };
  });

  const checkAnswer = (answer: string) => {
    setIsVerified(parseInt(answer) === question.correctAnswer);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerified) {
      alert("Please solve the verification question correctly.");
      return;
    }

    try {
      const response = await fetch("/api/visitors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, username, password, address }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(
          "Application submitted successfully! An email will be sent if your application is approved.",
        );
        navigate("/");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Image Side */}
      <div className="relative w-1/2 overflow-hidden shadow-[5px_0_18px_rgba(0,0,0,0.3)]">
        <img
          src={registerImage}
          alt="Register"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Form Side */}
      <div className="flex w-1/2 flex-col items-center justify-center p-8">
        <h2 className="mb-6 text-3xl font-semibold text-gray-800">Sign Up</h2>

        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={full_name}
                onChange={(e) => setFull_Name(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                What is {question.num1} + {question.num2}?
              </label>
              <input
                type="text"
                value={verificationAnswer}
                onChange={(e) => {
                  setVerificationAnswer(e.target.value);
                  checkAnswer(e.target.value);
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                placeholder="Answer the question"
              />
              {!isVerified && verificationAnswer && (
                <p className="mt-2 text-sm text-red-600">
                  Incorrect answer. Please try again.
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!isVerified}
              className={`w-full rounded-lg px-4 py-3 font-semibold text-white ${
                isVerified
                  ? "bg-[#3A5B22] transition duration-200 ease-in-out hover:bg-[#2F4A1A]"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Submit Application
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
