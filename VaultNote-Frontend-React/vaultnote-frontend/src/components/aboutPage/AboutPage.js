import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl p-10 bg-white shadow-xl rounded-lg border border-gray-200">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-6">
          About VaultNote
        </h1>
        <p className="text-gray-700 text-lg text-center mb-10">
          Welcome to VaultNote – the ultimate solution for secure and private note-taking.
          Our mission is to provide you with a digital vault where your thoughts, ideas, and sensitive
          information are protected by industry-leading encryption and robust security measures.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Features</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li>
                <span className="font-medium text-green-600">Advanced Encryption:</span> Your notes are secured with state-of-the-art encryption.
              </li>
              <li>
                <span className="font-medium text-green-600">Two-Factor Authentication:</span> Add an extra layer of protection to your account.
              </li>
              <li>
                <span className="font-medium text-green-600">Cloud Synchronization:</span> Access your secure notes anytime, anywhere.
              </li>
              <li>
                <span className="font-medium text-green-600">User-Friendly Interface:</span> Enjoy a modern, intuitive design that makes note-taking effortless.
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <img
              src="/logo192.png"
              alt="VaultNote Illustration"
              className="w-[250px] h-[250px] rounded-lg shadow-md"
            />
          </div>
        </div>
        <div className="mt-10 flex justify-center space-x-6">
          <Link className="text-white p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition" to="/">
            <FaFacebookF size={20} />
          </Link>
          <Link className="text-white p-3 bg-blue-500 rounded-full hover:bg-blue-600 transition" to="/">
            <FaTwitter size={20} />
          </Link>
          <Link className="text-white p-3 bg-blue-700 rounded-full hover:bg-blue-800 transition" to="/">
            <FaLinkedinIn size={20} />
          </Link>
          <Link className="text-white p-3 bg-pink-600 rounded-full hover:bg-pink-700 transition" to="/">
            <FaInstagram size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
