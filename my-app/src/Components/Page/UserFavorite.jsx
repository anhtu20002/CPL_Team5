import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const UserFavorite = () => {
  const [user, setUser] = useState([]);
  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const { username } = useParams();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
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

  // Fetch only favorited articles for the current user
  useEffect(() => {
    fetch(
      `https://api.realworld.io/api/articles?favorited=${encodeURIComponent(username)}&limit=10&offset=0`
    )
      .then((res) => res.json())
      .then((data) => {
        setFavoriteArticles(data.articles);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [username]); // Dependency on username to refetch on username change
  console.log(favoriteArticles);
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
        <NavLink className="text-decoration-none" to={`/profile/${username}/favorite`}>
          Favorited Articles
        </NavLink>
      </div>
      <div>
        {favoriteArticles.map((article) => (
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
              <button className="btn btn-sm btn-outline-success pull-xs-right">
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
        ))}
      </div>
    </div>
  );
};

export default UserFavorite;