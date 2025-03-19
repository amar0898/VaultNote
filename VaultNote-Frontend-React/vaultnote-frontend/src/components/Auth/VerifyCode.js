import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import InputField from "../InputField/InputField";
import Buttons from "../../utils/Buttons";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import { Blocks } from "react-loader-spinner";
import Divider from "@mui/material/Divider";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";

const VerifyUpdateCode = () => {
  const { currentUser, setCurrentUser, token,  setToken} = useMyContext();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onVerifyUpdateCodeHandler = async (data) => {
    const code = data.code;
    if (!code || code.trim().length === 0) {
      return showErrorToast("Verification code is required!");
    }
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("currentUsername", currentUser.username);
      await api.post("/auth/verify-verification-code", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      showSuccessToast("Code verified successfully. Please log in again.");

      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("USER");
      if (setCurrentUser) {
        setCurrentUser(null);
      }
      setToken(null);
      navigate("/login");
    } catch (error) {
      console.error("Error verifying update code", error);
      showErrorToast("Invalid or expired code! Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center bg-[#f0f4f8]">
    <React.Fragment>
      <form
        onSubmit={handleSubmit(onVerifyUpdateCodeHandler)}
        className="sm:w-[450px] w-[360px] bg-white shadow-lg rounded-lg py-8 sm:px-8 px-4 border border-gray-200 mx-auto mt-10"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-2xl text-gray-800">
            Verify Code
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Enter the verification code sent to your email to update your profile details.
          </p>
          <Divider className="font-semibold text-gray-400 pb-4" />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <InputField
            label="Enter your verification code"
            required
            id="code"
            type="text"
            message="*Code is required"
            placeholder="XXXXXX"
            register={register}
            errors={errors}
          />
        </div>
        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-[#27ae60] font-semibold text-white w-full py-2 hover:bg-[#2ecc71] transition-colors duration-100 rounded-md my-3"
          type="submit"
        >
          {loading ? <span>Loading...</span> : "Verify Code"}
        </Buttons>
      </form>
    </React.Fragment>
    </div>
  );
};

export default VerifyUpdateCode;
