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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [username, follow]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = token
          ? await fetch(
              `https://api.realworld.io/api/articles?author=${encodeURIComponent(
                username
              )}&limit=5&offset=0`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          : await fetch(
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
  console.log(user);

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
              ) : (
                <button onClick={() => handleFollow(user.profile?.username)}>
                  {user.profile?.following ? "Unfollow" : "Follow"}
                </button> // Other user's profile - display "Follow" or "Unfollow"
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
                      article.favorited
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
