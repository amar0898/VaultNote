import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <Router>
    <Navbar />
    <Toaster position="bottom-center" reverseOrder={false} />
    <Routes>
    <Route path="/" element={<LandingPage />} />
    </Routes>
    <Footer />
    </Router>
  );
}

export default App;
