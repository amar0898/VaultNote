import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

// Create an Axios instance
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

/* Function to get CSRF token from cookies
function getCsrfTokenFromCookie() {
  const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return matches ? decodeURIComponent(matches[1]) : null;
}*/

// Add a request interceptor to include JWT and CSRF tokens
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*let csrfToken = getCsrfTokenFromCookie();
    console.log("CSRF Token from cookie before calling the API :", document.cookie);
    if (!csrfToken) {
      try {
        await axios.get(
          `${process.env.REACT_APP_API_URL}/api/csrf-token`,
          { withCredentials: true, }
        ).then(response => {
          const csrfTokenFromCookie = getCsrfTokenFromCookie(); // Get CSRF token from cookie
          console.log('CSRF Token from Cookie:', csrfTokenFromCookie);
        });
        //csrfToken = response.data;
        //localStorage.setItem("CSRF_TOKEN", csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token", error);
      }
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    console.log("CSRF Token from cookie after calling the API :", document.cookie);
    console.log("X-XSRF-TOKEN " + csrfToken);*/
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;