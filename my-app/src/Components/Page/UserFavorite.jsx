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
  const [allArticles, setAllArticles] = useState([]);
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
    const fetchUserProfileAndFavorites = async () => {
      if (!isAuthenticated()) {
        alert("Please login to view favorited articles!");
        nav("/login");
        return;
      }

      try {
        // Fetch user profile
        const profileResponse = await fetch(
          `https://api.realworld.io/api/profiles/${username}`
        );
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await profileResponse.json();
        setUser(userData);

        // Retrieve favorited articles from local storage
        const storedArticles =
          JSON.parse(localStorage.getItem("favoriteArticles")) || [];

        setArticles(storedArticles);
        setIsLoading(false);

        // Fetch favorited articles from the API
        const favoritesResponse = await fetch(
          `https://api.realworld.io/api/articles?favorited=${user.profile.username}`
        );
        if (!favoritesResponse.ok) {
          throw new Error("Failed to fetch favorited articles");
        }
        const updatedArticleData = await favoritesResponse.json();
        setArticles(updatedArticleData.articles);

        // Update local storage with the fetched favorited articles
        localStorage.setItem(
          "favoriteArticles",
          JSON.stringify(updatedArticleData.articles)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchUserProfileAndFavorites();
  }, []);

  const handleUnfavorite = async (slug) => {
    if (!isAuthenticated()) {
      alert("Please login to unfavorite articles!");
      nav("/login");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // Remove the article from favorites
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}/favorite`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unfavorite article");
      }

      // Remove the article from the local state
      const updatedArticles = articles.filter(
        (article) => article.slug !== slug
      );
      setArticles(updatedArticles);
      localStorage.setItem("favoriteArticles", JSON.stringify(updatedArticles));

      // Add the deleted article to the deletedArticles state
      setDeletedArticles([...deletedArticles, slug]);
    } catch (error) {
      console.error("Error unfavoriting article:", error);
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
            .filter((article) => !deletedArticles.includes(article.slug))
            .map((article) => (
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
                    className="btn btn-sm btn-outline-success pull-xs-right"
                    onClick={() => handleUnfavorite(article.slug)}
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
              </div>
            ))
        ) : (
          <p>You haven't favorited any articles yet.</p>
        )}
      </div>
    </div>
  );
}
