import React from "react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPlus,
  faPen,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../Page/Details.module.css";
import { useParams, useNavigate } from "react-router-dom";

const Details = ({ myProfile }) => {
  const { slug } = useParams();
  const [article, setArticles] = useState(null);
  const [follow, setFollow] = useState(false);
  // console.log(myProfile.user.username);

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      const response = token
        ? await fetch(`https://api.realworld.io/api/articles/${slug}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await fetch(`https://api.realworld.io/api/articles/${slug}`);
      const data = await response.json();
      // console.log(data);
      setArticles(data.article);
    };

    fetchData();
  }, [article, follow, slug]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to follow users!");
      nav("/login");
      return;
    }

    const method = article.author.following ? "DELETE" : "POST"; // Determine API method based on follow state

    try {
      const response = await fetch(
        `https://api.realworld.io/api/profiles/${article.author.username}/follow`,
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

  const handleFavorite = async (article) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to favorite articles!");
      nav("/login");
      return;
    }

    try {
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

      setArticles(updatedArticleData.article);
    } catch (error) {
      console.error("Error favoriting/unfavoriting article:", error);
    }
  };

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
  const handleDelete = async () => {
    try {
      // Gửi yêu cầu DELETE đến API
      const response = await fetch(
        `https://api.realworld.io/api/articles/${slug}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Kiểm tra xem yêu cầu xóa đã thành công hay không
      if (response.ok) {
        console.log("Article deleted successfully");
        nav(-1)
        // nav(`/profile/${encodeURIComponent(myProfile.user?.username)}`);
        // Thực hiện các hành động cần thiết sau khi xóa bài viết, ví dụ: cập nhật trạng thái của ứng dụng, điều hướng người dùng, vv.
      } else {
        console.error("Error deleting article:", response.status);
        // Xử lý lỗi nếu có
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      // Xử lý lỗi nếu có
    }
  };
  const handleEdit = () => {
    // console.log("ok");
    nav(`/editor/${slug}`);
  }

  return (
    <div className={styles.article_page}>
      {article ? (
        <div>
          <div className={styles.banner}>
            <Container
              className="col-9"
              style={{ padding: "2rem 0", margin: "auto" }}
            >
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
                <div>
                  {article.author.username === myProfile.user?.username ? (
                    <div>
                      <button
                        className={`btn btn-sm action-btn ${styles.button_follow}`}
                        onClick={(e) => handleEdit(e)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                        <span> Edit Article</span>
                      </button>
                      <button
                        className={`btn btn-outline-danger btn-sm ${styles.button_favorite}`}
                        onClick={(e) => handleDelete(e)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span> Delete Article </span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleFollow(article.author.username)}
                        className={`btn btn-sm action-btn btn-secondary ${styles.button_follow}`}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        {article.author.following ? (
                          <span> Unfollow {article.author.username}</span>
                        ) : (
                          <span> Follow {article.author.username}</span>
                        )}
                      </button>
                      <button
                        onClick={() => handleFavorite(article)}
                        className={`btn btn-outline-success btn-sm ${styles.button_favorite}`}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        {article.favorited ? (
                          <span>
                            Unfavorite Article ({article.favoritesCount})
                          </span>
                        ) : (
                          <span>
                            Favorite Article ({article.favoritesCount})
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </div>

          <Container
            className="col-9"
            style={{
              color: "#373a3c",
              borderBottom: "1px solid #c5c5c5",
              margin: "auto",
              padding: "0",
            }}
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
        {token ? (
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
              <img
                src={`${myProfile.user?.image}`}
                alt="avatar"
                style={{ width: "32px", height: "32px", borderRadius: "100%" }}
              ></img>
              <button
                type="submit"
                className={`btn btn-outline-success btn-sm ${styles.button_comment}`}
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <p>
            <a href="/login">Sign in</a> or <a href="/register">Sign up</a> to
            add comments on this articles
          </p>
        )}
      </div>
    </div>
  );
};

export default Details;
