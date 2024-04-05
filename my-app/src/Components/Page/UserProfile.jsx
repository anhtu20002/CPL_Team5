import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState([]);
  const [follow, setFollow] = useState(false);
  const { username } = useParams();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [myFavorite, setMyFavorite] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  useEffect(() => {
    fetch(
      `https://api.realworld.io/api/articles?favorited=${localStorage.getItem(
        "username"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMyFavorite(data.articles);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [username]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `https://api.realworld.io/api/profiles/${encodeURIComponent(username)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://api.realworld.io/api/articles?author=${encodeURIComponent(
            username
          )}&limit=5&offset=0`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data.articles);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [username]);

  const handleFavorite = async (article) => {
    if (!isAuthenticated()) {
      alert("Please login to favorite articles!");
      nav("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const isFavorited = myFavorite.some((favArticle) => favArticle.slug === article.slug); // Check favorites list
      const method = isFavorited ? "DELETE" : "POST"; // Determine request method based on favorited state

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

      // Update local favorites state efficiently
      setMyFavorite((prevFavorites) => {
        const updatedFavorites = [...prevFavorites];
        const favoriteIndex = updatedFavorites.findIndex((fav) => fav.slug === article.slug);

        if (isFavorited) {
          updatedFavorites.splice(favoriteIndex, 1); // Remove from favorites if previously favorited
        } else {
          updatedFavorites.push(updatedArticleData.article); // Add to favorites if not previously favorited
        }

        return updatedFavorites;
      });

      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.slug === article.slug ? { ...a, ...updatedArticleData.article } : a
        )
      );

    } catch (error) {
      console.error("Error favoriting/unfavoriting article:", error);
    }
  };
  // console.log(articles);

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="container ">
          <div className="row text-center">
            <div className="col-xs-12 col-md-10">
              <img src={user.profile?.image} alt="" />
              <h4>{user.profile?.username}</h4>
              {username === localStorage.getItem("username") ? (
                <button>Settings</button>
              ) : follow ? (
                <button>Unfollow</button>
              ) : (
                <button>Follow</button>
              )}
            </div>
          </div>
        </div>
        <div className="header">
          <NavLink
            className="text-decoration-none pe-4"
            to={`/profile/${username}`}
          >
            My Articles
          </NavLink>
          <NavLink
            className="text-decoration-none"
            to={`/profile/${username}/favorite`}
          >
            Favorited Articles
          </NavLink>
        </div>
        {articles.length === 0 ? (
          <p>Loading articles...</p>
        ) : (
          <div>
            {articles.map((article) => (
              <div className="${profile-articles}" key={article.slug}>
                <div className={`author-info d-flex justify-content-between`}>
                  <div className="d-flex text-center">
                    <div>
                      <img src={article.author.image} alt="" />
                    </div>
                    <div>
                      <div>
                        <div>{article.author.username}</div>
                      </div>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFavorite(article)}
                    className={
                      myFavorite.some((favArticle) => favArticle.slug === article.slug)
                        ? "btn btn-sm btn-success pull-xs-right"
                        : "btn btn-sm btn-outline-success pull-xs-right"
                    }
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    {article.favoritesCount}
                  </button>
                </div>

                <div>
                  <div style={{ textDecoration: "none" }}>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="row">
                      <span className="col-md-2">Read more...</span>
                      <div className="col-md-7"></div>
                      <ul className="tag-list d-flex justify-content-between col-md-3">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
