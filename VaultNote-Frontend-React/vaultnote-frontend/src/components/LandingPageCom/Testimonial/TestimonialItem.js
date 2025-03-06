import React from "react";
import Avatar from "@mui/material/Avatar";
import { motion } from "framer-motion";

const TestimonialItem = ({ title, text, name, status, imgurl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col shadow-lg shadow-black rounded-xl"
    >
      <h1 className="text-white font-montserrat text-2xl font-bold pb-4">
        {title}
      </h1>

      <p className="text-gray-300 text-base">{text}</p>

      <div className="pt-5 flex gap-3 items-center">
        <Avatar alt={name} src={imgurl} />
        <div className="flex flex-col">
          <span className="text-white font-semibold">{name}</span>
          <span className="text-gray-400 text-sm">{status}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialItem;
