import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import api from "../../services/api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    mode: "onTouched",
  });

  const name = watch("name");
  const email = watch("email");
  const message = watch("message");

  const isFormFilled = name && email && message;

  const onSubmitHandler = async (data) => {
    //console.log("Form Data:", data);
    try {
      setLoading(true);
      const response = await api.post("/contact", data);
      showSuccessToast("Your message has been sent successfully. We will get back to you soon!");
      reset();
    } catch (error) {
      const errMessage = error?.response?.data?.message || "Failed to send message";
      showErrorToast(errMessage);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-74px)] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 text-center border border-gray-700">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-4">
          We'd love to hear from you! If you have any questions or feedback, feel free to reach out to us.
        </p>
        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
          <div>
            <label className="block text-left text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required." })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-left text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-left text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is invalid.",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-left text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-left text-gray-700 mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              {...register("message", { required: "Message is required." })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-left text-sm mt-1">{errors.message.message}</p>
            )}
          </div>
          <Buttons
            disabled={!isFormFilled}
            type="submit"
            className={`font-semibold text-white w-full py-2 transition-colors duration-100 rounded-md my-3 ${
              isFormFilled ? "bg-[#27ae60] hover:bg-[#2ecc71]" : "bg-[#2c3e50] hover:bg-[#34495e]"
            }`}
          >
            <div className="font-serif flex items-center justify-center gap-2">
              <span>{loading ? "Loading..." : "Send Message"}</span>
            </div>
          </Buttons>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
