import { useAuth0 } from "@auth0/auth0-react";
import loginImage from "../assets/loginImage.jpg";

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0();

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
          {/* Login Button */}
          <button
            type="button"
            className="w-full rounded-lg bg-[#3a5b22] px-4 py-3 font-semibold text-white transition hover:bg-[#034605]"
            onClick={() => loginWithRedirect()}
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
    </div>
  );
}
