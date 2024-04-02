import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  return (
    <Container className={styles.header}>
      <NavLink
        style={{ color: "#5cb85c", fontSize: "30px", textDecoration: "none" }}
        to="/"
      >
        <strong>Conduit</strong>
      </NavLink>

      {isLoggedIn ? (
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
            to="/profile"
          >
            User Profile
          </NavLink>
        </div>
      ) : (
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
      )}
    </Container>
  );
}
