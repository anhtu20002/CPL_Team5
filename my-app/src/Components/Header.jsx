import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <Container>
      <NavLink
        style={{ color: "#5cb85c", fontSize: "30px", textDecoration: "none" }}
        to="/"
      >
        <strong>Conduit</strong>
      </NavLink>
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
