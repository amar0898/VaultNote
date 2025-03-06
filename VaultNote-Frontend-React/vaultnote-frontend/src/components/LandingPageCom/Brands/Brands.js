import React from "react";
import { IoIosPartlySunny } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";
import { SiPythonanywhere } from "react-icons/si";
import { TbPackageExport } from "react-icons/tb";
import { FcAssistant } from "react-icons/fc";
import BrandItem from "./BrandItem";

const Brands = () => {
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 pt-20 md:px-0 px-5">
      <BrandItem
        title="End-to-End Encryption"
        text="Your notes are secured with state-of-the-art encryption, ensuring that only you can access your data."
        icon={IoIosPartlySunny}
      />
      <BrandItem
        title="Global Accessibility"
        text="Access your secure notes from anywhere in the world, on any device, with seamless cloud synchronization."
        icon={AiOutlineGlobal}
      />
      <BrandItem
        title="Uncompromised Security"
        text="Our robust security protocols safeguard your sensitive information against unauthorized access."
        icon={MdOutlineSecurity}
      />
      <BrandItem
        title="Seamless Synchronization"
        text="Enjoy real-time updates across all your devices, keeping your notes current and accessible."
        icon={SiPythonanywhere}
      />
      <BrandItem
        title="Smart Data Export"
        text="Effortlessly export your secure notes in various formats, giving you full control over your data."
        icon={TbPackageExport}
      />
      <BrandItem
        title="Personalized Assistance"
        text="Our dedicated support team is ready to provide personalized guidance for your secure note experience."
        icon={FcAssistant}
      />
    </div>
  );
};

export default Brands;
