import React from "react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faHeart,
  faPlus,
  faPen,
  faTrashCan,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "../Page/Details.module.css";
import { useParams, useNavigate } from "react-router-dom";

const Details = ({ myProfile }) => {
  const { slug } = useParams();
  const [article, setArticles] = useState(null);
  const [follow, setFollow] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
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

  // get comment
  useEffect(() => {
    getComments();
  }, []);

  const fetchComments = () => {
    console.log(slug);
    return fetch(`https://api.realworld.io/api/articles/${slug}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const getComments = async () => {
    let res = await fetchComments();
    let data = await res.json();
    console.log(data);
    setComments(data.comments);
  };

  // delete comment
  const fetchDeleteComment = (id) => {
    console.log(slug);
    return fetch(
      `https://api.realworld.io/api/articles/${slug}/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  const handleDeleteComment = (id) => {
    console.log(id);
    fetchDeleteComment(id).then((res) => {
      if (!res.ok) {
        toast.error("Error! Could not delete this Comment.");
      } else {
        getComments();
        toast.success("Successfully deleted the Comment!");
      }
    });
  };

  // add comment
  const fetchAddComment = (comment) => {
    return fetch(`https://api.realworld.io/api/articles/${slug}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: { body: comment } }),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.target.elements.comment.value);
    let commentInput = event.target.elements.comment;
    let comment = commentInput.value;
    if (!comment) {
      toast.info("Nothing to post Comment!!!");
      return;
    }
    fetchAddComment(comment)
      .then((res) => res.json())
      .then(() => {
        commentInput.value = "";
        getComments();
        toast.success("Comment added successfully");
      });
  };

  //delete article
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
        nav(-1);
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

  // edit article
  const handleEdit = () => {
    // console.log("ok");
    nav(`/editor/${slug}`);
  };

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
                <div className={styles.group_button}>
                  {article.author.username === myProfile.user?.username ? (
                    <div>
                      <button
                        className={`btn btn-sm  action-btn ${styles.button_editArticle}`}
                        onClick={(e) => handleEdit(e)}
                      >
                        <span>
                          <FontAwesomeIcon icon={faPen} />
                          &nbsp;Edit Article
                        </span>
                      </button>
                      <button
                        className={`btn btn-outline-danger btn-sm ${styles.button_delArticle}`}
                        onClick={(e) => handleDelete(e)}
                      >
                        <span>
                          <FontAwesomeIcon icon={faTrashCan} />
                          &nbsp;Delete Article{" "}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => handleFollow(article.author.username)}
                        className={
                          article.author.following
                            ? `btn btn-sm action-btn btn-secondary ${styles.button_unfollow}`
                            : `btn btn-sm action-btn btn-secondary ${styles.button_follow}`
                        }
                      >
                        {article.author.following ? (
                          <span>
                            <FontAwesomeIcon icon={faPlus} />
                            &nbsp;Unfollow {article.author.username}
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon icon={faPlus} /> &nbsp;Follow{" "}
                            {article.author.username}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => handleFavorite(article)}
                        className={
                          article.favorited
                            ? `btn btn-outline-success btn-sm ${styles.button_unfavorite}`
                            : `btn btn-outline-success btn-sm ${styles.button_favorite}`
                        }
                      >
                        {article.favorited ? (
                          <span>
                            <FontAwesomeIcon icon={faHeart} />
                            &nbsp;Unfavorite Article ({article.favoritesCount})
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon icon={faHeart} />
                            &nbsp;Favorite Article ({article.favoritesCount})
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
          <div>
            <form className="card comment-form" onSubmit={handleSubmit}>
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
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "100%",
                  }}
                ></img>
                <button
                  type="submit"
                  className={`btn btn-outline-success btn-sm ${styles.button_comment}`}
                >
                  Post Comment
                </button>
              </div>
            </form>
            {comments.map((item, index) => {
              return (
                <div className="card" style={{ marginTop: ".75rem" }}>
                  <div className="card-block" style={{ padding: "1.25rem" }}>
                    <p
                      className="card-text"
                      style={{ width: "560px", height: "auto" }}
                    >
                      {item.body}
                    </p>
                  </div>
                  <div
                    style={{ backgroundColor: "#f5f5f5", color: "#373a3c" }}
                    className="card-footer d-flex align-items-center justify-content-between p-3"
                  >
                    <div className={styles.author}>
                      <a>
                        <img
                          src={item.author.image}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "100%",
                          }}
                        />
                      </a>
                      &nbsp;
                      <a
                        className={styles.author_name}
                        href={`/profile/${item.author.username}`}
                      >
                        {item.author.username}
                      </a>
                      &nbsp;
                      <span style={{ color: "#bebcbc" }}>{item.createdAt}</span>
                    </div>
                    <span
                      className={styles.button_delComment}
                      onClick={() => handleDeleteComment(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
