import React from "react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import styles from "../Page/Details.module.css";
import { useParams } from "react-router-dom";

const Details = () => {
  const { slug } = useParams();
  const [article, setArticles] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}`
      );
      const data = await response.json();
      console.log(data);
      setArticles(data.article);
    };

    fetchData();
  }, [slug]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = async (comment) => {
    try {
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: { body: comment } }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const newComment = await response.json();
      setComments([...comments, newComment]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const handleAddComment = () => {
    addComment(newComment);
    setNewComment("");
  };

  return (
    <div className={styles.article_page}>
      {article ? (
        <div>
          <div className={styles.banner}>
            <Container style={{ padding: "2rem 0" }}>
              <strong style={{ color: "#ffffff", fontSize: "44.8px" }}>
                {article.title}
              </strong>
              <div className={styles.article_meta}>
                <a
                  href={
                    `/profile/` + encodeURIComponent(article.author.username)
                  }
                >
                  <img
                    src={article.author.image}
                    alt=""
                    className={styles.author_avatar}
                  />
                </a>
                <div>
                  <a
                    href={
                      `/profile/` + encodeURIComponent(article.author.username)
                    }
                    className={styles.info}
                  >
                    {article.author.username}
                  </a>
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <button
                  className={`btn btn-sm action-btn btn-secondary ${styles.button_follow}`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span> Follow</span>
                  <span> {article.author.username}</span>
                </button>
                <button
                  className={`btn btn-outline-success btn-sm ${styles.button_favorite}`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span> Favorite Article </span>
                  <span> ({article.favoritesCount})</span>
                </button>
              </div>
            </Container>
          </div>

          <Container
            style={{ color: "#373a3c", borderBottom: "1px solid #c5c5c5" }}
          >
            <p style={{ fontSize: "18px" }}>{article.description}</p>
            <p style={{ fontSize: "18px" }}>{article.body}</p>
            <div className={styles.tag_list}>
              <ul>
                {article.tagList.map((tag) => {
                  return (
                    <li className="tag-default tag-pill tag-outline" key={tag}>
                      {tag}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Container>
        </div>
      ) : (
        <p>Loading article...</p>
      )}

      <div className={styles.comment}>
        <form className="card comment-form">
          <div className="card-block">
            <textarea
              name="comment"
              placeholder="Write a comment..."
              className="form-control"
              rows={3}
            ></textarea>
          </div>
          <div
            style={{ backgroundColor: "#f5f5f5", color: "#373a3c" }}
            className="d-flex align-items-center justify-content-between p-3"
          >
            <span>avatar</span>
            <button
              type="submit"
              className={`btn btn-outline-success btn-sm ${styles.button_comment}`}
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Details;
