import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState([]);
  const [follow, setFollow] = useState(false);
  const { username } = useParams();
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true); 

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
      "https://api.realworld.io/api/profiles/" + encodeURIComponent(username)
    )
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [username]);

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(
        `https://api.realworld.io/api/articles?author=${username}&limit=5&offset=0`
      );
      const data = await response.json();

      if (isAuthenticated()) {
        const localStorageFavoritedArticles = JSON.parse(
          localStorage.getItem("favoritedArticles") || "{}"
        );

        const updatedArticles = data.articles.map((article) => {
          const favoritedFromStorage = localStorageFavoritedArticles[article.slug];
          return { ...article, favorited: favoritedFromStorage || false };
        });
        setArticles(updatedArticles);
      } else {
        setArticles(data.articles); // Set default state without favorited info
      }
      setIsLoading(false);
    };

    fetchArticles();
  }, [username, isAuthenticated]);

  const handleFavorite = async (article) => {
    if (!isAuthenticated()) {
      alert("Please login to favorite articles!");
      nav("/login");
      return;
    } else {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://api.realworld.io/api/articles/${article.slug}/favorite`,
          {
            method: article.favorited ? "DELETE" : "POST",
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to favorite/unfavorite article");
        }

        const updatedArticleData = await response.json();
        console.log("Updated article data from API:", updatedArticleData);

        const updatedArticles = articles.map((a) =>
          a.slug === article.slug ? { ...a, ...updatedArticleData.article } : a
        );
        setArticles(updatedArticles);

        // Update Local Storage with favorited state
        const localStorageFavoritedArticles = JSON.parse(
          localStorage.getItem("favoritedArticles") || "{}"
        );
        localStorageFavoritedArticles[article.slug] =
          updatedArticleData.article.favorited;
        localStorage.setItem(
          "favoritedArticles",
          JSON.stringify(localStorageFavoritedArticles)
        );
      } catch (error) {
        console.error("Error favoriting/unfavoriting article:", error);
      }
    }
  };

  console.log(articles);

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="container "></div>
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
            <div key={article.slug}>
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
                  className={article.favorited? ("btn btn-sm btn-success pull-xs-right"):("btn btn-sm btn-outline-success pull-xs-right")}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  {article.favoritesCount}
                </button>
              </div>

              <div>
                <div style={{ textDecoration: "none" }}>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
