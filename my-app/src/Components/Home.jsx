import React, { useEffect, useState } from "react";
// import Header from "./Header";
// import { SERVER_API } from "../Utils/config.js";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // fetch articles
  // useEffect(() => {
  //   fetch("https://api.realworld.io/api/articles")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data.articles);
  //       setArticles(data.articles);
  //       setTotalPages(Math.ceil(data.articlesCount / 10));
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }, []);

  useEffect(() => {
    getArticles(0);
  },[]);

  // lấy articles theo offset
  const getArticles = async (offset) => {
    let res = await fetchArticles(offset);
    let data = await res.json();
    setArticles(data.articles);
    setTotalPages(Math.ceil(data.articlesCount / 10));
  };

  // truyền offset vào api
  const fetchArticles = (offset) =>
    fetch("https://api.realworld.io/api/articles?offset=" + offset);

  // fetch Tags
  useEffect(() => {
    fetch("https://api.realworld.io/api/tags")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.tags);
        setTags(data.tags);
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

  // lấy số trang, set offset
  const handlePageClick = (event) => {
    console.log("event thư viện page: ", event);
    getArticles(event.selected * 10);
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

      <Container className="mt-3">
        <Row>
          <Col md={9}>
            <div className="my-3">Global Feed</div>
            {articles.map((article, index) => {
              return (
                <div>
                  <div
                    className={`${styles.author_info} d-flex justify-content-between`}
                  >
                    <div className="d-flex ">
                      <a href="#">
                        <img src={article.author.image} alt="" />
                      </a>
                      <div>
                        <a href="#">{article.author.username}</a>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-success pull-xs-right">
                      <FontAwesomeIcon icon={faHeart} />
                      <span>{article.favoritesCount}</span>
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
            <ReactPaginate
              nextLabel=">"
              previousLabel="<"
              pageCount={totalPages}
              marginPagesDisplayed={0}
              pageRangeDisplayed={totalPages}
              onPageChange={handlePageClick}
              pageClassName={`${styles.page_fill}page-item`}
              pageLinkClassName="page-link"
              containerClassName="pagination d-flex flex-wrap"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page- item"
              nextLinkClassName="page-link"
              activeClassName="active"
            />
          </Col>
          <Col md={3} className={styles.sidebar}>
            <div>
              <span>Popular Tags</span>
              <div className={styles.tag_list}>
                {tags.map((tag, index) => {
                  return <a href="#">{tag}</a>;
                })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
