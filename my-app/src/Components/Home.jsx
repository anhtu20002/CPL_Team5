import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [fillTag, setFillTag] = useState("");
  const [toggleTag, setToggleTag] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isFetchingFromFeed, setIsFetchingFromFeed] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingArticleWithPage, setIsLoadingArticleWithPage] =
    useState(true);

  const nav = useNavigate();

  //set active tag
  const [activeItem, setActiveItem] = useState("globalFeed");
  const [activeTag, setActiveTag] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      if (!isFetchingFromFeed) {
        getArticles(fillTag, 0, token);
      } else {
        setActiveItem("yourFeed");
        getArticlesFromFeed(0, token); // New function to fetch from feed
      }
    } else {
      getArticles(fillTag, 0, false);
    }
  }, [fillTag, isFetchingFromFeed, token, toggleTag]);

  // lấy articles theo offset, filltag
  const getArticles = async (fillTag, offset, token) => {
    setIsLoadingArticles(true); // Bắt đầu quá trình tải dữ liệu
    let res = await fetchArticles(fillTag, offset, token);
    let data = await res.json();

    console.log(data.articles);
    setArticles(data.articles);
    setTotalPages(Math.ceil(data.articlesCount / 10));
    setIsLoadingArticles(false); // Kết thúc quá trình tải dữ liệu
  };

  // truyền offset vào api
  const fetchArticles = (fillTag, offset, token) => {
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
    setIsLoadingArticles(true); // Bắt đầu quá trình tải dữ liệu
    let res = await fetchArticlesFromFeed(offset, token);
    let data = await res.json();

    console.log(data.articles);
    setArticles(data.articles);
    setTotalPages(Math.ceil(data.articlesCount / 10));
    setIsLoadingArticles(false); // Kết thúc quá trình tải dữ liệu
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
    setIsLoadingTags(true); // Bắt đầu quá trình tải dữ liệu
    fetch("https://api.realworld.io/api/tags")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.tags);
        setTags(data.tags);
        setIsLoadingTags(false); // Kết thúc quá trình tải dữ liệu
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoadingTags(false); // Kết thúc quá trình tải dữ liệu
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
      } else {
        getArticlesFromFeed(event.selected * 10, token); // New function to fetch from feed
      }
    } else {
      getArticles(fillTag, event.selected * 10);
    }
  };

  // fill tags
  const handleClickTags = (event, tag) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    console.log("Clicked tag:", tag);
    setFillTag(tag);
    setToggleTag(tag);
    setIsFetchingFromFeed(false);
    setActiveItem(tag);
    setActiveTag(tag);
    console.log(activeItem, toggleTag);
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

  const handleFavorite = async (article) => {
    if (!token) {
      alert("Please login to favorite articles!");
      nav("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const method = article.favorited ? "DELETE" : "POST";

      const response = await fetch(
        `https://api.realworld.io/api/articles/${article.slug}/favorite`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to favorite/unfavorite article");
      }

      const updatedArticleData = await response.json();

      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.slug === article.slug ? { ...a, ...updatedArticleData.article } : a
        )
      );
    } catch (error) {
      console.error("Error favoriting/unfavoriting article:", error);
    }
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
        <p style={{ color: "white", fontSize: "24px" }}>
          A place to share your knowledge.
        </p>
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
            {isLoadingArticles ? (
              <div className="text-center">
                <ReactLoading
                  className={styles.loadingContainer}
                  type={"spinningBubbles"}
                  color={"black"}
                  height={30}
                  width={30}
                />
                <p>Loading Articles...</p>
              </div>
            ) : (
              <div>
                {articles.length === 0 ? (
                  <div style={{margin: '0 auto', alignItems: 'center', display: 'flex'}}>
                    <span>No articles are here... yet.</span>
                  </div>
                ) : (
                  <>
                    {articles.map((article, index) => {
                      return (
                        <div key={index} className={styles.title}>
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
                              <button
                                onClick={() => handleFavorite(article)}
                                className={
                                  article.favorited
                                    ? `btn btn-sm pull-xs-right ${styles.activated}`
                                    : "btn btn-sm btn-outline-success pull-xs-right"
                                }
                              >
                                <FontAwesomeIcon icon={faHeart} />
                                <span>{article.favoritesCount}</span>
                              </button>
                            </div>
                          </div>

                          <div className={styles.article_info}>
                            <Link to={`/article/${article.slug}`}>
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
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {totalPages > 0 ? (
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
                    ) : null}
                  </>
                )}
              </div>
            )}
          </Col>
          <Col md={3} className={styles.sidebar}>
            {isLoadingTags ? (
              <div>
                <span>Loading Tags...</span>
              </div>
            ) : (
              <div>
                <span>Popular Tags</span>
                <div className={styles.tag_list}>
                  {tags.map((tag, index) => {
                    return (
                      <a key={index}
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
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;