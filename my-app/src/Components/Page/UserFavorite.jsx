import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useParams, NavLink } from "react-router-dom";

export default function UserFavorite() {
  const [articles, setArticles] = useState([]);
  const [user, setUser] = useState([]);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();
  const [deletedArticles, setDeletedArticles] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
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
  }, [username]);

  useEffect(() => {
    const fetchArticles = async () => {
      const token = localStorage.getItem("token");
      try {
        const response =  token ? await fetch(
          `https://api.realworld.io/api/articles?favorited=${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ): await fetch(
          `https://api.realworld.io/api/articles?favorited=${username}`,
        )
        ;

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

  const handleFavorite = async (slug) => {
    const token = localStorage.getItem("token");
  
    if (!isAuthenticated()) {
      alert("Please login to favorite articles!");
      nav("/login");
      return;
    }
  
    const isCurrentlyFavorited = articles.find((article) => article.slug === slug)?.favorited;
    const newState = [...articles]; // Create a copy of the state
  
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}/favorite`,
        {
          method: isCurrentlyFavorited ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update favorite status");
      }
  
      const updatedArticle = await response.json();
      const updatedArticleIndex = newState.findIndex((article) => article.slug === slug);
  
      if (updatedArticleIndex !== -1) {
        newState[updatedArticleIndex] = updatedArticle.article; // Update article in state
        setArticles(newState); // Update component state with the modified articles
      } else {
        console.warn("Article not found in state after update (unexpected)");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  return (
    <div>
      <div className="user-info">
        <div className="container "></div>
        <div className="row text-center">
          <div className="col-xs-12 col-md-10">
            <img src={user.profile?.image} alt="" />
            <h4>{user.profile?.username}</h4>
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
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : articles.length > 0 ? (
          articles
            
            .map((article) => (
              !deletedArticles.includes(article.slug) && (article.favorited || !article.favorited)?
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
                    className={
                      article.favorited
                        ? "btn btn-sm btn-success pull-xs-right"
                        : "btn btn-sm btn-outline-success pull-xs-right"
                    }
                    onClick={() => handleFavorite(article.slug)}
                  >
                    <FontAwesomeIcon icon={faHeart} /> {article.favoritesCount}
                  </button>
                </div>

                <div>
                  <div style={{ textDecoration: "none" }}>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {article.tagList.map((tag) => (
                          <li
                            className="tag-default tag-pill tag-outline"
                            key={tag}
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>:null
            ))
        ) : (
          <p>You haven't favorited any articles yet.</p>
        )}
      </div>
    </div>
  );
}
