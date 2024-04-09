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
import UserFavorite from "./Components/Page/UserFavorite";
import Details from "./Components/Page/Details";
import Footer from "./Components/Footer";
import DetailArticle from "./Components/Page/DetailArticle";
// import  {ToastContainer } from  
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myProfile, setMyProfile]= useState([]);

  const [authStatus, setAuthStatus] = useState("UNAUTHENTICATED");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthStatus(token ? "AUTHENTICATED" : "UNAUTHENTICATED");
  }, [localStorage.getItem("token")]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchData = async () => {
      const response = await fetch(
        "https://api.realworld.io/api/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setMyProfile(data);
    };

    fetchData();
  }, [myProfile]);

  return (
    <div className="App">
      {authStatus === "AUTHENTICATED" ? <HomePage myProfile={myProfile}/> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/article/:slug" element={<Details/>}/> */}
        <Route
          path="/login"
          element={<Login setAuthStatus={setAuthStatus} />}
        />
        <Route path="/register" element={<Signup setAuthStatus={setAuthStatus}/>} />
        <Route path="/editor" element={<Article />} />
        <Route
          path="/settings"
          element={<Settings setAuthStatus={setAuthStatus} />}
        />
        <Route path="/profile/:username" element={<UserProfile myProfile={myProfile}/>} />
        <Route path="/profile/:username/favorites" element={<UserFavorite myProfile={myProfile} />} />
        <Route path="/article/:slug" element={<DetailArticle/>} />
      </Routes>
      <Footer />
      <ToastContainer/>
    </div>
  );
};

export default App;
