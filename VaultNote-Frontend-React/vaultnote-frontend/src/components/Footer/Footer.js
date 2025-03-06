import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 z-50 relative">
      <div className="xl:px-10 sm:px-8 px-6 flex lg:flex-row flex-col justify-between items-center gap-4">
        <ul className="flex flex-1 md:gap-8 gap-4 text-white flex-row items-center font-montserrat">
          <li>
            <Link to="/about">
              <span className="hover:underline">About Us</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="hover:underline">Services</span>
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <span className="hover:underline">Contact</span>
            </Link>
          </li>
          <li>
            <Link to="/">
              <span className="hover:underline">Privacy Policy</span>
            </Link>
          </li>
        </ul>
        <p className="text-white text-base font-montserrat font-bold">
          &copy; {currentYear} VaultNote | All rights reserved.
        </p>
        <div className="flex-1 flex flex-row gap-6 justify-end items-center">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Link
              className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
              to="https://facebook.com"
            >
              <FaFacebookF />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Link
              className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
              to="https://linkedin.com"
            >
              <FaLinkedinIn />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Link
              className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
              to="https://twitter.com"
            >
              <FaTwitter />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <Link
              className="text-white border h-10 w-10 flex justify-center items-center border-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
              to="https://instagram.com"
            >
              <FaInstagram />
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
