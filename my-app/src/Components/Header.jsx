import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink, Route, Routes } from "react-router-dom";
import styles from "./Header.module.css";
import Login from "./Login"
import Signup from "./Signup"
export default function Header() {
  return (
    <Container>
      <Routes>
        <Route path="/" element={ <Header /> } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </Container>
  );
}
