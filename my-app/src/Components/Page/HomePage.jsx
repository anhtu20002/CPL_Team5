import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import styles from "../Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faGear } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [user, setUser] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
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
      setUser(data);
    };

    fetchData();
  }, [token, user]);
  console.log(user);
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
          to="/editor"
        >
          <FontAwesomeIcon className='me-1' icon={faPenToSquare} />
          New Article
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to="/settings"
        >
          <FontAwesomeIcon className='me-1' icon={faGear} />
          Settings
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? styles.link_active : styles.link
          }
          to={`/profile/${encodeURIComponent(
            localStorage.getItem("username")
          )}`}
        >
          <img
            className="mb-1 me-1"
            style={{ width: "24px", height: "24px", borderRadius: "100%" }}
            src={`${user.user?.image}`}
            alt=""
          ></img>
          {user.user?.username}
        </NavLink>
      </div>
    </Container>
  );
};

export default HomePage;
