import React from "react";
import { motion } from "framer-motion";

const BrandItem = ({ text, icon: Icon, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 120 }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col items-center gap-3 justify-center shadow-lg shadow-black rounded-xl"
    >
      <Icon className="text-white text-6xl" />
      <h3 className="text-xl text-white font-bold">{title}</h3>
      <p className="text-gray-300 text-center">{text}</p>
    </motion.div>
  );
};

export default BrandItem;
