import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { motion } from "framer-motion";

export default function CardSlider() {
  return (
    <Swiper
      effect={"cards"}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper w-[260px] h-[340px]"
    >
      <SwiperSlide>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center h-full w-full rounded-lg bg-gradient-to-br from-blue-900 to-gray-800 text-white font-bold text-xl shadow-lg transition-all duration-300"
        >
          Vault Note
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center h-full w-full rounded-lg bg-gradient-to-br from-indigo-900 to-gray-700 text-white font-bold text-xl shadow-lg transition-all duration-300"
        >
          Instant Sync
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center h-full w-full rounded-lg bg-gradient-to-br from-purple-900 to-gray-800 text-white font-bold text-xl shadow-lg transition-all duration-300"
        >
          Rapid Access
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center h-full w-full rounded-lg bg-gradient-to-br from-gray-800 to-black text-white font-bold text-xl shadow-lg transition-all duration-300"
        >
          Robust Security
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center h-full w-full rounded-lg bg-gradient-to-br from-green-800 to-gray-700 text-white font-bold text-xl shadow-lg transition-all duration-300"
        >
          Uncompromised Privacy
        </motion.div>
      </SwiperSlide>
    </Swiper>
  );
}
