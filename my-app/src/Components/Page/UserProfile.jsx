import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlus, faGear } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styles from "./UserProfile.module.css";
import Spinner from "react-bootstrap/Spinner";

export default function UserProfile() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState([]);
  const [follow, setFollow] = useState(false);
  const { username } = useParams();
  const nav = useNavigate();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Page number (0-based)
  const [itemsPerPage, setItemsPerPage] = useState(5); // Articles per page
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  const handleFollow = async (username) => {
    if (!isAuthenticated()) {
      alert("Please login to follow users!");
      nav("/login");
      return;
    }

    const token = localStorage.getItem("token");
    const method = user.profile?.following ? "DELETE" : "POST"; // Determine API method based on follow state

    try {
      const response = await fetch(
        `https://api.realworld.io/api/profiles/${username}/follow`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow user");
      }

      const updatedFollowStatus = await response.json();
      setFollow(updatedFollowStatus.profile.following); // Update local follow state
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = token
          ? await fetch(
              `https://api.realworld.io/api/profiles/${encodeURIComponent(
                username
              )}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : await fetch(
              `https://api.realworld.io/api/profiles/${encodeURIComponent(
                username
              )}`
            );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await response.json();
        setUser(userData);
        setIsLoadingProfile(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [username, follow]);

  useEffect(() => {
    const fetchArticles = async () => {
      const offset = currentPage * itemsPerPage;
      try {
        setIsLoadingArticles(true);
        const response = token
          ? await fetch(
              `https://api.realworld.io/api/articles?author=${encodeURIComponent(
                username
              )}&limit=${itemsPerPage}&offset=${offset}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : await fetch(
              `https://api.realworld.io/api/articles?author=${encodeURIComponent(
                username
              )}&limit=${itemsPerPage}&offset=${offset}`
            );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles);
        if (currentPage === 0 && data.articles.length === itemsPerPage) {
          setTotalPages(
            Math.ceil((data.articlesCount || articles.length) / itemsPerPage)
          ); // Use articles.length if articlesCount is unavailable
        }
        setIsLoadingArticles(false);
        setIsLoadingPagination(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [username, currentPage, itemsPerPage]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    setIsLoadingPagination(true);
  };

  const handleFavorite = async (article) => {
    if (!isAuthenticated()) {
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
  console.log(isLoadingArticles, isLoadingProfile, isLoadingPagination);

  return (
    <div className="">
      {isLoadingArticles && isLoadingProfile ? (
        <div style={{ margin: "auto", width: "1%" }}>
          <Spinner animation="grow" variant="success" />
        </div>
      ) : (
        <div className="">
          <div className="">
            <div
              className="row text-center"
              style={{ backgroundColor: "#f3f3f3" }}
            >
              <div className={`${styles.profile} col-7 my-4`}>
                <img
                  className="rounded-circle mb-1 mt-3"
                  src={user.profile?.image}
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
                <h4 className="fw-bold">{user.profile?.username}</h4>
                <p style={{ color: "#b6b4b6" }}>{user.profile?.bio}</p>
                {username === localStorage.getItem("username") ? (
                  <button
                    onClick={() => nav("/settings")}
                    className={`${styles.follow} btn btn-sm btn-outline-secondary`}
                  >
                    <FontAwesomeIcon icon={faGear} /> Edit Profile Settings
                  </button>
                ) : (
                  <button
                    className={`${styles.follow} btn btn-sm btn-outline-secondary`}
                    onClick={() => handleFollow(user.profile?.username)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    {user.profile?.following
                      ? ` Unfollow ${user.profile?.username}`
                      : ` Follow ${user.profile?.username}`}
                  </button> // Other user's profile - display "Follow" or "Unfollow"
                )}
              </div>
            </div>
          </div>
          <div className={`${styles.profile} col-7 mt-5`}>
            <div className={`${styles.header}`}>
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <NavLink
                    className="text-decoration-none"
                    to={`/profile/${username}`}
                  >
                    My Articles
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="text-decoration-none"
                    to={`/profile/${username}/favorites`}
                  >
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            {articles.length > 0 && !isLoadingPagination ? (
              <div>
                {articles.map((article) => (
                  <div key={article.slug} className={`${styles.article} py-2`}>
                    <div
                      className={`${styles.author_info} d-flex justify-content-between`}
                    >
                      <div className="d-flex">
                        <a
                          href={
                            `/profile/` +
                            encodeURIComponent(article.author.username)
                          }
                        >
                          <img src={article.author.image} alt="" />
                        </a>
                        <div>
                          <div>
                            <a
                              href={
                                `/profile/` +
                                encodeURIComponent(article.author.username)
                              }
                            >
                              {article.author.username}
                            </a>
                          </div>
                          <div>
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
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

                    <div className={styles.article_preview}>
                      <a href="" style={{ textDecoration: "none" }}>
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
                ))}
              </div>
            ) : isLoadingPagination ? (
              <div style={{ margin: "auto", width: "1%" }}>
                <Spinner animation="grow" variant="success" />
              </div>
            ) : (
              <p>No articles found.</p>
            )}
            <div>
              {totalPages > 0 && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
