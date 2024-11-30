import { useAuth0 } from "@auth0/auth0-react";
import loginImage from "../assets/loginImage.jpg";
import { generateQuestion } from "../../utils/generateQuestion.js";
import { useState } from "react";
import QuestionModal from "./QuestionModal.js";
import Chatbot from "../components/ChatBot.js";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();
  const { question, answer } = generateQuestion();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOnClose = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSumbit = () => {
    alert("Submitted");
    loginWithRedirect();
    setIsModalOpen(!false);
  };

  return (
    <div className="flex h-screen">
      {/* <Chatbot /> */}

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
          {/* Login Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-[#3a5b22] px-4 py-3 font-semibold text-white transition hover:bg-[#034605]"
            onClick={toggleModal}
          >
            Sign in
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            onClick={() => loginWithRedirect()}
          >
            Sign Up
          </a>
        </p>
      </div>
      {isModalOpen && (
        <QuestionModal
          question={question}
          correctAnswer={answer}
          onClose={handleOnClose}
          onCorrectAnswer={handleSumbit}
        />
      )}
    </div>
  );
}
