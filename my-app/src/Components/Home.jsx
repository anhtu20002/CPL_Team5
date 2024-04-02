import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import { SERVER_API } from "../Utils/config.js";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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

  // format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <div
        className="container-fluid py-4 text-center"
        style={{
          color: "white",
          backgroundColor: "#5cb85c",
        }}
      >
        <b className="logo-font" style={{ fontSize: "56px" }}>
          conduit
        </b>
        <p style={{ fontSize: "24px" }}>A place to share your knowledge.</p>
      </div>

      <Container>
        <Row>
          <Col md={9}>
            <Row>
              <Col>Global Feed</Col>
            </Row>
            {articles.map((article, index) => {
              return (
                <div>
                  <div className={`author-info d-flex justify-content-between`}>
                    <div className="d-flex text-center">
                      <a href="#">
                        <img src={article.author.image} alt="" />
                      </a>
                      <div>
                        <div>
                          <a href="#">{article.author.username}</a>
                        </div>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-primary pull-xs-right">
                      <FontAwesomeIcon icon={faHeart} />
                      {article.favoritesCount}
                    </button>
                  </div>

                  <div className={styles.article_info}>
                    <a href="#" style={{ textDecoration: "none" }}>
                      <h3>{article.title}</h3>
                      <p>{article.description}</p>
                      <div>
                        <span>Read more...</span>
                        <ul className="tag-list">
                          {article.tagList.map((tag) => {
                            return (
                              <li
                                className="tag-default tag-pill tag-outline"
                                key={tag}
                              >
                                {tag}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </a>
                  </div>
                </div>
              );
            })}
          </Col>
          <Col md={3}>tag</Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
