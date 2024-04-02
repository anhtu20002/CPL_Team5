// import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { useEffect, useState } from 'react';
import HomePage from './Components/Page/HomePage';
import Article from './Components/Page/Article';
import Settings from './Components/Page/Settings';
import UserProfile from './Components/Page/UserProfile';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [localStorage.getItem('token')]); // Sử dụng token làm dependency

  return (
    <div className="App">
      {isLoggedIn ? <HomePage /> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path='/editor' element={<Article/>} />
        <Route path='/settings' element={<Settings/> } />
        <Route path='/profile/' element={<UserProfile/> } />
      </Routes>
    </div>
  );
};

export default App;
