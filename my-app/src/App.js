// import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { useEffect, useState } from "react";
import HomePage from "./Components/Page/HomePage";
import Article from "./Components/Page/Article";
import Settings from "./Components/Page/Settings";
import UserProfile from "./Components/Page/UserProfile";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [authStatus, setAuthStatus] = useState("UNAUTHENTICATED");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthStatus(token ? "AUTHENTICATED" : "UNAUTHENTICATED");
  }, [localStorage.getItem("token")]);

  return (
    <div className="App">
      {authStatus === "AUTHENTICATED" ? <HomePage /> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login setAuthStatus={setAuthStatus} />}
        />
        <Route path="/register" element={<Signup />} />
        <Route path="/editor" element={<Article />} />
        <Route
          path="/settings"
          element={<Settings setAuthStatus={setAuthStatus} />}
        />
        <Route path="/profile/" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
