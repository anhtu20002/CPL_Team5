import React from "react";
import { Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        marginTop: "3rem",
        padding: "16px 0",
        bottom: "0",
        width: "100%",
      }}
    >
      <Container>
        <Link style={{ textDecoration: "none" }} to="/">
          <strong style={{ color: " #5cb85c" }}>conduit</strong>
        </Link>
        <span
          style={{
            marginLeft: "10px",
            fontSize: ".8rem",
            color: "#bbb",
            fontWeight: "300",
          }}
        >
          An interactive learning project from&nbsp;
          <a
            href="https://thinkster.io/"
            style={{ color: " #5cb85c", textDecoration: "none" }}
          >
            Thinkster
          </a>
          . Code & design licensed under MIT.
        </span>
      </Container>
    </div>
  );
};

export default Footer;
