import React from "react";
import { Link } from "react-router-dom";
import Buttons from "../utils/Buttons";
import { motion } from "framer-motion";
import Brands from "./LandingPageCom/Brands/Brands";
import State from "./LandingPageCom/State";
import Testimonial from "./LandingPageCom/Testimonial/Testimonial";
import { useMyContext } from "../store/ContextApi";

const fadeInFromTop = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const fadeInFromBottom = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingPage = () => {
  const { token } = useMyContext();

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="lg:w-[80%] w-full py-16 space-y-4 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-4"
        >
          <img
            src="/logo512.png"
            alt="VaultNote Logo"
            className="w-[250px] h-[250px] rounded-lg shadow-md"
          />
        </motion.div>

        <motion.h1
          className="font-montserrat uppercase xl:text-5xl md:text-4xl text-3xl mx-auto text-center font-bold sm:w-[95%] w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInFromTop}
        >
          Secure Your Ideas in a Digital Vault
        </motion.h1>
        <h3 className="md:text-2xl text-xl font-semibold text-gray-300 text-center">
          Your Ultimate Secure Note-Taking Solution
        </h3>
        <p className="text-gray-400 text-center sm:w-[80%] w-[90%] mx-auto">
          Experience unmatched security and effortless organization. With
          cutting-edge encryption and seamless synchronization, your thoughts
          are always protected and accessible wherever you go.
        </p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInFromBottom}
          className="flex items-center justify-center gap-5 py-10"
        >
          {token ? (
            <>
              <Link to="/create-note">
                <Buttons className="sm:w-52 w-44 bg-red-600 font-semibold hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-md">
                  Create Note
                </Buttons>
              </Link>
              <Link to="/notes">
                <Buttons className="sm:w-52 w-44 bg-blue-600 font-semibold hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-md">
                  My Notes
                </Buttons>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Buttons className="sm:w-52 w-44 bg-red-600 font-semibold hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-md">
                  Sign In
                </Buttons>
              </Link>
              <Link to="/signup">
                <Buttons className="sm:w-52 w-44 bg-blue-600 font-semibold hover:scale-105 transition-all duration-200 cursor-pointer text-white px-10 py-3 rounded-md">
                  Sign Up
                </Buttons>
              </Link>
            </>
          )}
        </motion.div>
        <div className="sm:pt-14 pt-0 xl:px-16 md:px-10">
          <h1 className="font-montserrat uppercase text-white xl:text-5xl md:text-4xl text-3xl mx-auto text-center font-bold w-full">
            Trusted by Professionals Worldwide
          </h1>
          <Brands />
          <State />
          <div className="pb-10">
            <h1 className="font-montserrat uppercase text-white pb-16 xl:text-5xl md:text-4xl text-3xl mx-auto text-center font-bold sm:w-[95%] w-full">
              What Our Users Say
            </h1>
            <Testimonial />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
