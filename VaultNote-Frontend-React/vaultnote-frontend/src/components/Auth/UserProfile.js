import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const UserProfile = () => {
  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser, token } = useMyContext();
  const navigate = useNavigate();
  //const { id } = useParams();
  //set the loggin session from the token 
  const [loginSession, setLoginSession] = useState(null);

  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();

  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enable, Step 2: Verify

  //loading state
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  //profile photo
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(currentUser?.profilePhotoUrl);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  const watchedUsername = watch("username");
  const watchedPassword = watch("password");
  const isChanged = (currentUser && watchedUsername !== currentUser.username) || (watchedPassword && watchedPassword.trim().length > 0);

  //fetching the 2fa sttaus

  useEffect(() => {
    setPageLoader(true);

    const fetch2FAStatus = async () => {
      try {
        const response = await api.get(`/auth/user/2fa-status`);
        setIs2faEnabled(response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        showErrorToast("Error while fetching 2FA status!");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  //enable the 2fa
  const enable2FA = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-2fa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch (error) {
      showErrorToast("Error in enabling 2FA to your account!");
    } finally {
      setDisbledLoader(false);
    }
  };

  //diable the 2fa

  const disable2FA = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-2fa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      showErrorToast("Error in disabling 2FA to your account!");
    } finally {
      setDisbledLoader(false);
    }
  };

  //verify the 2fa
  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return showErrorToast("Two-factor authentication code verification failed. Please try again!");

    settwofaCodeLoader(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);

      await api.post(`/auth/verify-2fa`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      showSuccessToast("2FA verified successfully.");

      setIs2faEnabled(true);
      setStep(1);
    } catch (error) {
      console.error("Error verifying 2FA", error);
      showErrorToast("Invalid 2FA Code!");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  //update the user profile credentials
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;

    // Check if the user has provided any change. If neither is updated, show error.
  if (!newUsername && !newPassword) {
    return showErrorToast("Please enter a new username or new password to update!");
  }

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("currentUsername", currentUser.username);
      if (newUsername && newUsername !== currentUser.username) {
        formData.append("newUsername", newUsername);
      }
      if (newPassword) {
        formData.append("newPassword", newPassword);
      }
      await api.post("/auth/send-verification-code", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      showSuccessToast("A verification code has been sent to your email. Please verify it to update your credentials.");
      navigate("/verify-code");
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to send verification code for credentials update!");
    } finally {
      setLoading(false);
    }
  };

  //set the status of (credentialsNonExpired, accountNonLocked, enabled and credentialsNonExpired) current user
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);

      //moment npm package is used to format the date
      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("D MMMM YYYY");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      //set the loggin session from the token
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  // Fetch profile photo from the backend
  const fetchProfilePhoto = async () => {
    try {
      const response = await api.get(`/auth/${currentUser.id}/get-profile-photo`, {
        responseType: "blob",
      });
      // Convert the blob into an object URL and update the state
      const imageUrl = URL.createObjectURL(response.data);
      setProfilePhotoUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching profile photo:", error);
    }
  };


  //// brhbr
  useEffect(() => {
    if (currentUser && currentUser.id) {
      fetchProfilePhoto();
    }
  }, [currentUser]);

  //update the AccountExpiryStatus
  const handleAccountExpiryStatus = async (event) => {
    setAccountExpired(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      showSuccessToast("Account expiry status updated.");
    } catch (error) {
      showErrorToast("Account expiry status updation failed!");
    } finally {
      setLoading(false);
    }
  };

  //update the AccountLockStatus
  const handleAccountLockStatus = async (event) => {
    setAccountLock(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("lock", event.target.checked);

      await api.put("/auth/update-lock-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      showSuccessToast("Account lock status updatded.");
    } catch (error) {
      showErrorToast("Account lock status updation failed!");
    } finally {
      setLoading(false);
    }
  };

  //update the AccountEnabledStatus
  const handleAccountEnabledStatus = async (event) => {
    setAccountEnabled(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("enabled", event.target.checked);

      await api.put("/auth/update-enabled-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      showSuccessToast("Account enabled status updated.");
    } catch (error) {
      showErrorToast("Account enable status updation failed!");
    } finally {
      setLoading(false);
    }
  };

  //update the CredentialExpiredStatus
  const handleCredentialExpiredStatus = async (event) => {
    setCredentialExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-credentials-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //fetchUser();
      showSuccessToast("Credentials expiry status updated.");
    } catch (error) {
      showErrorToast("Credentials expiry status updation Failed");
    } finally {
      setLoading(false);
    }
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  //two function for opening and closing the according
  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };
  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  //profile photo feature
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
    setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) return showErrorToast("Please select a file to upload");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "user",
      new Blob([JSON.stringify(currentUser)], { type: "application/json" })
    );

    try {
      const response = await api.post(`/auth/${currentUser.id}/upload-profile-photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response from upload ",response.data);
      await fetchProfilePhoto();
      showSuccessToast("Profile photo updated successfully");
    } catch (error) {
      console.error("Error in uploading profile photo: ", error);
      showErrorToast("Error in uploading profile photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] py-10">
      {pageLoader ? (
        <>
          {" "}
          <div className="flex  flex-col justify-center items-center  h-72">
            <span>
              <Blocks
                height="70"
                width="70"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
              />
            </span>
            <span>Please wait...</span>
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="xl:w-[70%] lg:w-[80%] sm:w-[90%] w-full sm:mx-auto sm:px-0 px-4   min-h-[500px] flex lg:flex-row flex-col gap-4 ">
            <div className="flex-1  flex flex-col shadow-lg shadow-gray-300 gap-2 px-4 py-6">
              <div className="flex flex-col items-center gap-2   ">
                <Avatar
                alt={currentUser?.username}
                src={profilePhotoUrl || "/default-avatar.png"}
                sx={{ width: 120, height: 120 }}
                />
                <h3 className="font-semibold text-2xl">
                  {currentUser?.username}
                </h3>
              <input type="file" onChange={handleImageChange} accept="image/*" />
              </div>
            <Buttons
            disabled={uploading}
            onClickhandler={handleUpload}
            className="mt-4 bg-btnColor text-white px-4 py-2 rounded-md">
            {uploading ? "Uploading..." : "Update Profile Photo"}
            </Buttons>
              <div className="my-4 ">
                <div className="py-3">
                  <Accordion expanded={openAccount}>
                    <AccordionSummary
                      className="shadow-md shadow-gray-300"
                      onClick={onOpenAccountHandler}
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <h3 className="text-slate-800 text-lg font-semibold ">
                        Edit Profile
                      </h3>
                    </AccordionSummary>
                    <AccordionDetails className="shadow-md shadow-gray-300">
                      <form
                        className=" flex flex-col gap-3"
                        onSubmit={handleSubmit(handleUpdateCredential)}
                      >
                        <InputField
                          label="Username"
                          required
                          id="username"
                          className="text-sm"
                          type="text"
                          message="*Username is required"
                          placeholder="Type your new username"
                          register={register}
                          errors={errors}
                        />{" "}
                        <InputField
                          label="Email"
                          required
                          id="email"
                          className="text-sm"
                          type="email"
                          message="*Email is required"
                          placeholder="Type your email"
                          register={register}
                          errors={errors}
                          readOnly
                        />{" "}
                        <InputField
                          label="Password"
                          id="password"
                          className="text-sm"
                          type="password"
                          message="*Password is required"
                          placeholder="Type your new password"
                          register={register}
                          errors={errors}
                          min={6}
                        />
                        <Buttons
                        disabled={loading || !isChanged}
                        className="bg-btnColor font-semibold flex justify-center text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-md my-3"
                        type="submit">
                        {loading ? <span>Loading...</span> : "Update"}
                      </Buttons>
                      </form>
                    </AccordionDetails>
                  </Accordion>
                  <div className="pt-10 ">
                    <h3 className="text-slate-800 text-lg font-semibold  mb-2 px-2">
                      Last Login Session
                    </h3>
                    <div className="shadow-md shadow-gray-300 px-4 py-2 rounded-md">
                      <p className="text-slate-700 text-sm">
                        Your last Log in session when you are logged in <br />
                        <span>{loginSession}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col shadow-lg shadow-gray-300 gap-2 px-4 py-6">
              <div className="space-y-1">
                <h1 className="text-slate-800 flex items-center gap-1 text-2xl font-bold">
                  <span>Multi Factor Authentication</span>
                  <span
                    className={` ${
                      is2faEnabled ? "bg-green-600" : "bg-customRed"
                    } px-2 text-center py-1 text-xs mt-1 rounded-md text-white ml-2`}
                  >
                    {is2faEnabled ? "Activated" : "Deactivated"}
                  </span>
                </h1>{" "}
                
                <p className="text-slate-800 text-sm ">
                Two-factor authentication adds an additional layer of security to your account to keep it protected and safe by requiring more than just a password to sign in.
                </p>
              </div>

              <div>
                <Buttons
                  disabled={disabledLoader}
                  onClickhandler={is2faEnabled ? disable2FA : enable2FA}
                  className={` ${
                    is2faEnabled ? "bg-customRed" : "bg-green-600"
                  } px-5 py-1 hover:text-slate-300 rounded-md my-3 text-white mt-2`}
                >
                  {disabledLoader ? (
                    <>Loading...</>
                  ) : (
                    <>
                      {is2faEnabled
                        ? "Disabled Two-Factor Authentication"
                        : "Enable Two-Factor Authentication"}
                    </>
                  )}
                </Buttons>
              </div>
              {step === 2 && (
                <div className="py-3">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <h3 className="font-bold text-lg  text-slate-700">
                        Scan the QR code
                      </h3>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="">
                        <img src={qrCodeUrl} alt="QR Code" />
                        <div className="flex items-center  gap-2  mt-4">
                          <input
                            type="text"
                            placeholder="XXXXXX"
                            value={code}
                            required
                            className="mt-4 border px-2 py-1 border-slate-800 rounded-md"
                            onChange={(e) => setCode(e.target.value)}
                          />
                          <button
                            className="bg-green-600 text-white  px-3 h-9 rounded-md mt-4"
                            onClick={verify2FA}
                          >
                            {twofaCodeLoader ? "Loading..." : "Verify 2FA code"}
                          </button>
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
