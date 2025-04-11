import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../public/assets/undraw_chore-list_ylw0.svg"

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-8 py-12 text-center md:text-left">
      {/* Left Section - Text + Buttons */}
      <div className="max-w-xl md:w-1/2 space-y-6">
        <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">
          Welcome to Task Reminder
        </h1>
        <p className="text-lg text-gray-700">
          Organize your day, prioritize your work, and never miss a task again!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg shadow transition duration-300"
          >
            Register
          </button>
        </div>
      </div>

      {/* Right Section - Hero Image */}
      <div className="md:w-1/2 mb-10 md:mb-0">
        <img
          src={heroImg}
          alt="Hero Illustration"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </div>
  );
};

export default Home;
