import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [articles, setArticles] = useState([]);
  const { username } = useParams(); // Get userId from URL parameter
  useEffect(() => {
    fetch(
      `https://api.realworld.io/api/articles?author=${username}&limit=5&offset=0`
    )
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles); // Assuming articles are within data.articles
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [username]); // Run effect only when userId changes

  console.log(articles);

  return (
    <div className="user-profile">
      {" "}
      {/* Add a class for styling */}
      <h2>Articles by {username}</h2> {/* Display user's name */}
      {articles.length === 0 ? (
        <p>Loading articles...</p>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.slug}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
