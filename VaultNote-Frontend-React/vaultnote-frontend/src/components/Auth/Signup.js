import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { showSuccessToast } from "../../utils/toast";

const Signup = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const { token } = useMyContext();
  const navigate = useNavigate();
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

   // Watch the values of username and password fields
    const username = watch("username");
    const password = watch("password");
  
    // Effect to update `isFormFilled` state based on input values
    useEffect(() => {
      if (username && password) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    }, [username, password]);

  useEffect(() => {
    setRole("ROLE_USER");
  }, []);

  const onSubmitHandler = async (data) => {
    const { username, email, password } = data;
    const sendData = {
      username,
      email,
      password,
      role: [role],
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/public/signup", sendData);
      showSuccessToast("Your account created successfully!");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: This username is already taken. Please try different username!"
      ) {
        setError("username", { message: "This username is already taken. Please try different username!" });
      } else if (
        error?.response?.data?.message === "Error: This email is already taken. Please try with different email!"
      ) {
        setError("email", { message: "This email is already taken. Please try with different email!" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-[#f0f4f8]">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="sm:w-[450px] w-[360px] bg-white shadow-lg rounded-lg py-8 sm:px-8 px-4 border border-gray-200"
      >
        <div>
          <h1 className="font-serif text-center font-bold text-3xl text-gray-800">
            Register Here
          </h1>
          <p className="font-serif text-gray-600 text-center mt-2">
            Enter your details to create a new account!
          </p>
          <div className="flex items-center justify-between gap-1 py-5">
            <a
              href={`${apiUrl}/oauth2/authorization/google`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm rounded-md hover:bg-gray-100 transition-all duration-300"
            >
              <FcGoogle className="text-2xl" />
              <span className="font-serif font-semibold sm:text-customText text-xs text-gray-700">
                Login with Google
              </span>
            </a>
            <a
              href={`${apiUrl}/oauth2/authorization/github`}
              className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm rounded-md hover:bg-gray-100 transition-all duration-300"
            >
              <FaGithub className="text-2xl" />
              <span className="font-serif font-semibold sm:text-customText text-xs text-gray-700">
                Login with Github
              </span>
            </a>
          </div>
  
          <Divider className="font-serif font-semibold text-gray-400">
            OR
          </Divider>
        </div>
  
        <div className="flex flex-col gap-2 mt-4 font-serif">
          <InputField
            label="Username"
            required
            id="username"
            type="text"
            message="*Username is required"
            placeholder="Type your username"
            register={register}
            errors={errors}
          />
          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="*Email is required"
            placeholder="Type your email"
            register={register}
            errors={errors}
          />
          {/* Wrap password field in a relative container */}
          <div className="relative">
            <InputField
              label="Password"
              required
              id="password"
              type={showPassword ? "text" : "password"}
              message="*Password is required"
              placeholder="Type your password"
              register={register}
              errors={errors}
              min={6}
            />
            <button
              type="button"
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <Buttons
              disabled={loading || !isFormFilled} // Disable button if form is not filled
              onClickhandler={() => {}}
              className={`font-semibold text-white w-full py-2 transition-colors duration-100 rounded-md my-3 ${
                isFormFilled ? "bg-[#27ae60] hover:bg-[#2ecc71]" : "bg-[#2c3e50] hover:bg-[#34495e]"
              }`}
              type="text"
            >
              <div className="font-serif flex items-center justify-center gap-2">
                <span>{loading ? "Loading..." : "Register"}</span>
              </div>
            </Buttons>
  
        <p className="font-serif text-center text-sm text-gray-700 mt-6">
          Already have an account?{" "}
          <Link
            className="font-semibold underline hover:text-[#3498db]"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
