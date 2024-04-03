import React from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "../Header.module.css";

const HomePage = () => {
  return (
    <Container className={styles.header}>
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
          to="/editor"
        >
          New Article
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to="/settings"
        >
          Settings
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to={`/profile/${encodeURIComponent(localStorage.getItem("username"))}`}
        >
          User Profile
        </NavLink>
      </div>
    </Container>
  );
};

export default HomePage;
