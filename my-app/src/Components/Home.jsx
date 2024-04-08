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
  const [fillTag, setFillTag] = useState("");
  const [toggleTag, setToggleTag] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isFetchingFromFeed, setIsFetchingFromFeed] = useState(true);

  //set avctive tag
  const [activeItem, setActiveItem] = useState("yourFeed");
  const [activeTag, setActiveTag] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      if (!isFetchingFromFeed) {
        getArticles(fillTag, 0, token);
        console.log("check");
      } else {
        getArticlesFromFeed(0, token); // New function to fetch from feed
      }
    }
    getArticles(fillTag, 0, false);
    console.log(fillTag);
  }, [fillTag, isFetchingFromFeed, token]);

  // lấy articles theo offset, filltag
  const getArticles = async (fillTag, offset, token) => {
    let res = await fetchArticles(fillTag, offset, token);
    let data = await res.json();

    console.log(data.articles);
    setArticles(data.articles);
    setTotalPages(Math.ceil(data.articlesCount / 10));
  };

  // const fetchArticlesFromFeed = async (offset, token) => {
  //   console.log("check");
  //   try {
  //     const res = await fetch(
  //       `api.realworld.io/api/articles/feed?offset=${offset}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     const data = await res.json();
  //     setArticles(data.articles);

  //     setTotalPages(Math.ceil(data.articlesCount / 10));
  //   } catch (err) {
  //     console.error("Error fetching articles from feed:", err);
  //   }
  // };

  // truyền offset vào api
  const fetchArticles = (fillTag, offset, token) => {
    console.log(token);
    if (fillTag.trim().length > 0) {
      return fetch(
        `https://api.realworld.io/api/articles?tag=${fillTag}&offset=${offset}`
      );
    } else if (token) {
      return fetch(`https://api.realworld.io/api/articles?offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else
      return fetch("https://api.realworld.io/api/articles?offset=" + offset);
  };

  const getArticlesFromFeed = async (offset, token) => {
    let res = await fetchArticlesFromFeed(offset, token);
    let data = await res.json();

    console.log("chekc");
    console.log(data.articles);
    setArticles(data.articles);
    setTotalPages(Math.ceil(data.articlesCount / 10));
  };
  const fetchArticlesFromFeed = (offset, token) => {
    return fetch(
      `https://api.realworld.io/api/articles/feed?offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

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
    if (token) {
      if (!isFetchingFromFeed) {
        getArticles(fillTag, event.selected * 10, token);
        console.log("check");
      } else {
        getArticlesFromFeed(event.selected * 10, token); // New function to fetch from feed
      }
    }
    getArticles(fillTag, event.selected * 10);
  };

  // fill tags
  const handleClickTags = (event, tag) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    console.log("Clicked tag:", tag);
    setFillTag(tag);
    setToggleTag(tag);
    setActiveItem(tag);
    setActiveTag(tag);
  };

  //toggle your feed
  const handleFetchFromFeed = () => {
    setActiveItem("yourFeed");
    setIsFetchingFromFeed(true);
  };

  // toggle global feed
  const handleToggleFeed = () => {
    setActiveItem("globalFeed");
    setIsFetchingFromFeed(false);
    setFillTag("");
  };

  const handleToggleTag = (tag) => {
    setActiveItem(tag);
    setFillTag(tag);
    setIsFetchingFromFeed(false);
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

      <Container className="mt-4">
        <Row>
          <Col md={9}>
            <div className={`${styles.feed_toggle}`}>
              <ul className="nav nav-pills outline-active">
                {token ? (
                  <li className={activeItem === "yourFeed" ? "active" : ""}>
                    <a onClick={handleFetchFromFeed}>Your Feed</a>
                  </li>
                ) : null}
                <li className={activeItem === "globalFeed" ? "active" : ""}>
                  <a onClick={handleToggleFeed}>Global Feed</a>
                </li>
                {toggleTag === "" ? null : (
                  <li
                    className={`nav-item ${
                      activeItem === toggleTag ? "active" : ""
                    }`}
                  >
                    <a onClick={() => handleToggleTag(toggleTag)}>
                      #{toggleTag}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            {articles.map((article, index) => {
              return (
                <div  key={index} className={styles.title}>
                  <div
                    className={`${styles.author_info} d-flex justify-content-between`}
                  >
                    <div className="d-flex ">
                      <a
                        href={
                          `/profile/` +
                          encodeURIComponent(article.author.username)
                        }
                      >
                        <img
                          style={{ width: "32px", height: "32px" }}
                          src={article.author.image}
                          alt=""
                        />
                      </a>
                      <div>
                        <a
                          href={
                            `/profile/` +
                            encodeURIComponent(article.author.username)
                          }
                        >
                          {article.author.username}
                        </a>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-success pull-xs-right">
                        <FontAwesomeIcon icon={faHeart} />
                        <span>{article.favoritesCount}</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.article_info}>
                    <a href={`/article/${article.slug}`} style={{ textDecoration: "none" }}>
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
              pageClassName={styles.pageItem}
              pageLinkClassName={styles.pageLink}
              containerClassName="pagination d-flex flex-wrap"
              previousClassName={styles.previous}
              previousLinkClassName={styles.pageLink}
              nextClassName={styles.next}
              nextLinkClassName={styles.pageLink}
              activeClassName={styles.active}
            />
          </Col>
          <Col md={3} className={styles.sidebar}>
            <div>
              <span>Popular Tags</span>
              <div className={styles.tag_list}>
                {tags.map((tag, index) => {
                  return (
                    <a
                      className={
                        activeTag === tag ? styles.activeTag : styles.tag
                      }
                      href
                      onClick={(event) => handleClickTags(event, tag)}
                    >
                      {tag}
                    </a>
                  );
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
