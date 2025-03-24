import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../InputField/InputField";
import toast from "react-hot-toast";
import Buttons from "../../utils/Buttons";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const navigate = useNavigate();
  const password = watch("password");
  const isFormFilled = password;

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (data) => {
    const { password } = data;

    const token = searchParams.get("token");

    setLoading(true);
    try {
      const formData = new URLSearchParams();

      formData.append("token", token);
      formData.append("newPassword", password);
      await api.post("/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      showSuccessToast("Password reset successfully. You can now log in to your account.");
      reset();
      navigate("/login");
    } catch (error) {
      showErrorToast("Error while resetting your password. Please check and try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-serif text-center font-bold text-2xl">
            Update Your Password
          </h1>
          <p className="font-serif text-slate-600 text-center">
            Enter your new Password to Update it
          </p>
        </div>
        <Divider className="font-semibold pb-4"></Divider>

        <div className="flex flex-col gap-2 mt-4 font-serif">
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="enter your new Password"
            register={register}
            errors={errors}
            min={6}
          />{" "}
        </div>
        <Buttons
              disabled={loading || !isFormFilled}
              onClickhandler={() => {}}
              className={`font-semibold text-white w-full py-2 transition-colors duration-100 rounded-md my-3 ${
                isFormFilled ? "bg-[#FF0000] hover:bg-[#2ecc71]" : "bg-[#2c3e50] hover:bg-[#34495e]"
              }`}
              type="text"
            >
              <div className="font-serif flex items-center justify-center gap-2">
                <span>{loading ? "Loading..." : "Update"}</span>
              </div>
            </Buttons>
        <p className="font-serif text-sm text-slate-700 ">
          <Link className=" underline hover:text-black" to="/login">
            Back To Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;