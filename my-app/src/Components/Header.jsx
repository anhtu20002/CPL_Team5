import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
// import Login from "./Login"
// import Signup from "./Signup"
export default function Header() {
  return (
    <Container>
      <NavLink  to="/">
        Home
      </NavLink>
      <NavLink to="/login">
        Sign in
      </NavLink>
      <NavLink  to="/register">
        Sign up
      </NavLink>
    </Container>
  );
}
