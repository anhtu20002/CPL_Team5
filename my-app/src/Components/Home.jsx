import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import { SERVER_API } from "../Utils/config.js";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://api.realworld.io/api/articles")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.articles);
        setArticles(data.articles);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>

      <Container>
        {articles.map((item, idex) => {
          return (
            <div>
              <p>Title: {item.slug}</p>
            </div>
          );
        })}
      </Container>
    </div>
  );
};

export default Home;
