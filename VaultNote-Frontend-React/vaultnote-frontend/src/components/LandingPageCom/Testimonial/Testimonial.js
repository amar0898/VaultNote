import React from "react";
import TestimonialItem from "./TestimonialItem";

const Testimonial = () => {
  return (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 md:px-0 px-5">
      <TestimonialItem
        title="Game-Changer"
        text="Vault Note has revolutionized the way I capture my thoughts. The encryption gives me peace of mind, and the interface is incredibly intuitive. I never worry about losing my ideas again!"
        name="Alex Johnson"
        status="Entrepreneur"
        imgurl="https://randomuser.me/api/portraits/men/32.jpg"
      />
      <TestimonialItem
        title="Reliable & Secure"
        text="I love how Vault Note keeps my sensitive information private while making it easy to organize all my notes. It's my go-to app for secure documentation."
        name="Emily Carter"
        status="Freelance Writer"
        imgurl="https://randomuser.me/api/portraits/women/45.jpg"
      />
      <TestimonialItem
        title="Best Note-Taking App"
        text="Switching to Vault Note was the best decision for managing my professional notes. The robust encryption and seamless sync across devices are truly impressive."
        name="Michael Lee"
        status="Software Engineer"
        imgurl="https://randomuser.me/api/portraits/men/65.jpg"
      />
    </div>
  );
};

export default Testimonial;
