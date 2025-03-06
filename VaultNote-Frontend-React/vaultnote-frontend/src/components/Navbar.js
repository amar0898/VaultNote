import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaLock } from "react-icons/fa"; // Added lock icon for a secure feel
import { useMyContext } from "../store/ContextApi";

const Navbar = () => {
  // Handle header menu toggle for mobile/tablet devices
  const [headerToggle, setHeaderToggle] = useState(false);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  // Access states using useMyContext hook
  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } = useMyContext();

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN"); // Remove token from localStorage
    localStorage.removeItem("USER"); // Remove user details as well
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <header className="h-headerHeight z-50 bg-gray-900 text-white shadow-md flex items-center sticky top-0">
      <nav className="sm:px-10 px-4 flex w-full h-full items-center justify-between">
        <Link to="/" className="flex items-center">
          <h3 className="font-bold font-dancingScript text-4xl">Vault Note</h3>
          <FaLock className="ml-3 text-2xl" />
        </Link>
        <ul
          className={`lg:static absolute left-0 top-16 w-full lg:w-fit lg:px-0 sm:px-10 px-4 lg:bg-transparent bg-gray-900 ${
            headerToggle
              ? "min-h-fit max-h-navbarHeight lg:py-0 py-4 shadow-md shadow-slate-700 lg:shadow-none"
              : "h-0 overflow-hidden"
          } lg:h-auto transition-all duration-100 font-montserrat text-white flex lg:flex-row flex-col lg:gap-8 gap-2`}
        >
          {token && (
            <>
              <Link to="/notes">
                <li
                  className={`py-2 cursor-pointer hover:text-gray-400 ${
                    pathName === "/notes" ? "font-semibold" : ""
                  }`}
                >
                  My Notes
                </li>
              </Link>
              <Link to="/create-note">
                <li
                  className={`py-2 cursor-pointer hover:text-gray-400 ${
                    pathName === "/create-note" ? "font-semibold" : ""
                  }`}
                >
                  Create Note
                </li>
              </Link>
            </>
          )}

          <Link to="/contact">
            <li
              className={`py-2 cursor-pointer hover:text-gray-400 ${
                pathName === "/contact" ? "font-semibold" : ""
              }`}
            >
              Contact
            </li>
          </Link>

          <Link to="/about">
            <li
              className={`py-2 cursor-pointer hover:text-gray-400 ${
                pathName === "/about" ? "font-semibold" : ""
              }`}
            >
              About
            </li>
          </Link>

          {token ? (
  <>
    <Link to="/profile">
      <li
        className={`py-2 cursor-pointer hover:text-gray-400 ${
          pathName === "/profile" ? "font-semibold" : ""
        }`}
      >
        Profile
      </li>
    </Link>
    {isAdmin && (
      <Link to="/admin/users">
        <li
          className={`py-2 cursor-pointer uppercase hover:text-gray-400 ${
            pathName.startsWith("/admin") ? "font-semibold" : ""
          }`}
        >
          Admin
        </li>
      </Link>
    )}
    <button
      onClick={handleLogout}
      className="min-w-[100px] text-center bg-red-700 text-white font-bold font-montserrat py-2 px-6 rounded-md transition-all duration-300 hover:bg-red-600 shadow-md"
    >
      Log Out
    </button>
  </>
) : (
  <Link to="/signup">
    <li className="min-w-[100px] text-center bg-blue-700 text-white font-bold font-montserrat py-2 px-6 rounded-md transition-all duration-300 hover:bg-blue-600 shadow-md">
      Sign Up
    </li>
  </Link>
)}

        </ul>
        <span
          onClick={() => setHeaderToggle(!headerToggle)}
          className="lg:hidden block cursor-pointer text-white shadow-md hover:text-gray-400"
        >
          {headerToggle ? (
            <RxCross2 className="text-2xl" />
          ) : (
            <IoMenu className="text-2xl" />
          )}
        </span>
      </nav>
    </header>
  );
};

export default Navbar;
