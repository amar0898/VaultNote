import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/LandingPage";
import './App.css';

const App = () => {
  return (
    <Router>
    <Toaster position="bottom-center" reverseOrder={false} />
    <Routes>
    <Route path="/" element={<LandingPage />} />
    </Routes>
    </Router>
  );
}

export default App;
