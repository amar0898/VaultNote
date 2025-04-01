import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added icons
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken, token } = useMyContext();
  const navigate = useNavigate();
  const [isFormFilled, setIsFormFilled] = useState(false); // State to track if both fields are filled
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const {
    register,
    handleSubmit,
    reset,
    watch, // Use `watch` from react-hook-form to track input values
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
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

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));
    setToken(token);
    navigate("/notes");
  };

  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data);
      showSuccessToast("Logged in successfully!");
      reset();
      if (response.status === 200 && response.data.jwtToken) {
        setJwtToken(response.data.jwtToken);
        const decodedToken = jwtDecode(response.data.jwtToken);
        if (decodedToken.is2faEnabled) {
          setStep(2);
        } else {
          handleSuccessfulLogin(response.data.jwtToken, decodedToken);
        }
      } else {
        showErrorToast("Login failed. Please check your username or password and try again!");
      }
    } catch (error) {
      if (error) {
        console.log(error);
        showErrorToast("There is no account with this username or password. Please check your credentials and try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);
      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      showErrorToast("Invalid 2FA code. Please check and try to log in again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-[#f0f4f8]">
      {step === 1 ? (
        <React.Fragment>
          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="sm:w-[450px] w-[360px] bg-white shadow-lg rounded-lg py-8 sm:px-8 px-4 border border-gray-200"
          >
            <div>
              <h1 className="font-serif text-center font-bold text-3xl text-gray-800">
                Vault Note Login
              </h1>
              <p className=" font-serif text-gray-600 text-center mt-2">
                Log in to continue to your Vault Note account!
              </p>
              <div className="flex items-center justify-between gap-1 py-5">
                <Link
                  to={`${apiUrl}/oauth2/authorization/google`}
                  className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm rounded-md hover:bg-gray-100 transition-all duration-300"
                >
                  <FcGoogle className="text-2xl" />
                  <span className="font-serif font-semibold sm:text-customText text-xs text-gray-700">
                    Login with Google
                  </span>
                </Link>
                <Link
                  to={`${apiUrl}/oauth2/authorization/github`}
                  className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm rounded-md hover:bg-gray-100 transition-all duration-300"
                >
                  <FaGithub className="text-2xl" />
                  <span className="font-serif font-semibold sm:text-customText text-xs text-gray-700">
                    Login with Github
                  </span>
                </Link>
              </div>
              <Divider className="font-serif font-semibold text-gray-400">OR</Divider>
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
              <div className="relative">
                <InputField
                  label="Password"
                  required
                  id="password"
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  message="*Password is required"
                  placeholder="Type your password"
                  register={register}
                  errors={errors}
                />
                <button
                  type="button"
                  className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
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
                <span>{loading ? "Loading..." : "Log In"}</span>
              </div>
            </Buttons>
            <p className="font-serif text-sm text-gray-700">
              <Link
                className="underline hover:text-[#3498db]"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>
            <p className="font-serif text-center text-sm text-gray-700 mt-6">
              Don't have an account?{" "}
              <Link
                className="font-semibold underline hover:text-[#3498db]"
                to="/signup"
              >
                SignUp
              </Link>
            </p>
          </form>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form
            onSubmit={handleSubmit(onVerify2FaHandler)}
            className="sm:w-[450px] w-[360px] bg-white shadow-lg rounded-lg py-8 sm:px-8 px-4 border border-gray-200"
          >
            <div>
              <h1 className="font-montserrat text-center font-bold text-2xl text-gray-800">
                Verify 2FA
              </h1>
              <p className="text-gray-600 text-center mt-2">
                Enter the correct code to complete 2FA Authentication
              </p>
              <Divider className="font-semibold text-gray-400 pb-4"></Divider>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <InputField
                label="Enter Code"
                required
                id="code"
                type="text"
                message="*Code is required"
                placeholder="Enter your 2FA code"
                register={register}
                errors={errors}
              />
            </div>
            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className="bg-[#27ae60] font-semibold text-white w-full py-2 hover:bg-[#2ecc71] transition-colors duration-100 rounded-md my-3"
              type="text"
            >
              {loading ? <span>Loading...</span> : "Verify 2FA"}
            </Buttons>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default Login;