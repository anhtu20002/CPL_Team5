import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Article() {
  const token = localStorage.getItem("token");
  const SERVER_API = "https://api.realworld.io/api";
  const { slug } = useParams();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    about: "",
    tags: "",
  });

  // Trạng thái xác định hành động là thêm mới hay chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_API}/articles/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();

        // Đặt thông tin của bài viết vào state formData để điền vào form khi chỉnh sửa
        setFormData({
          title: data.article.title,
          content: data.article.body,
          about: data.article.description,
          tags: data.article.tagList.join(", "),
        });
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    // Nếu có slug được truyền vào, đặt trạng thái là chỉnh sửa
    if (slug) {
      setIsEditing(true);
      fetchData();
    }
  }, [slug, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (isEditing) {
        // Nếu đang chỉnh sửa, gửi yêu cầu cập nhật bài viết đã tồn tại
        response = await fetch(`${SERVER_API}/articles/${slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            article: {
              title: formData.title,
              description: formData.about,
              body: formData.content,
              tagList: formData.tags.split(",").map((tag) => tag.trim()),
            },
          }),
        });
      } else {
        // Nếu không phải chỉnh sửa, gửi yêu cầu tạo bài viết mới
        response = await fetch(`${SERVER_API}/articles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            article: {
              title: formData.title,
              description: formData.about,
              body: formData.content,
              tagList: formData.tags.split(",").map((tag) => tag.trim()),
            },
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to submit article");
      }

      toast.success(
        isEditing
          ? "Article updated successfully"
          : "Article created successfully"
      );
      nav(`/article/${slug}`);
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error("Failed to submit article");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="container col-8 mt-5" style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className="mb-3">
          <input
            placeholder="Article Title"
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            placeholder="What's this article about?"
            type="text"
            className="form-control"
            id="about"
            name="about"
            value={formData.about}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Write your article (in markdown)"
            className="form-control"
            id="content"
            name="content"
            rows="8"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <input
            placeholder="Enter tags"
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#5CB85C",
            color: "white",
            border: "none",
            fontSize: "18px",
            padding: "10px 25px",
            marginTop: "10px",
            borderRadius: "5px",
            float: "right",
          }}
        >
          {isEditing ? "Update Article" : "Publish Article"}
        </button>
      </form>
    </div>
  );
}
