// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
// import Login from './Components/Login';
// import Signup from './Components/Signup';
import { useEffect, useState } from 'react';
import HomePage from './Components/Page/HomePage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState( );
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      setIsLoggedIn(true);

    }
    setIsLoggedIn(false);
  },[])

  return (
    <div className="App">
      {isLoggedIn ? <HomePage /> : <Header />}
      <Home/>
    </div>
  );
};

export default App;
