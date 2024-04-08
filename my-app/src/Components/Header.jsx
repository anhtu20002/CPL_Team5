import React from "react";
import { Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";
// import Login from "./Login"
// import Signup from "./Signup"
export default function Header() {
  return (
    <Container className={styles.header}>
      <Link
        style={{ color: "#5cb85c", fontSize: "28px", textDecoration: "none" }}
        to="/"
      >
        <strong>conduit</strong>
      </Link>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to="/login"
        >
          Sign in
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to="/register"
        >
          Sign up
        </NavLink>
      </div>
    </Container>
  );
}
