import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Article() {
  const token = localStorage.getItem("token");
  const SERVER_API = "https://api.realworld.io/api";
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    about: "",
    tags: "",
  });

  // const [errorMessage, setErrorMessage] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // console.log(formData);
  const postwithToken = async (url, token, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    // console.log(JSON.stringify(data));
    // console.log("Data: ",data);
    return response.json();
  };

  // Handler khi người dùng ấn nút đăng nhập
  const handleSubmit = async  (event) => {
    event.preventDefault();
    try {
      // Gọi API đăng nhập sử dụng phương thức postwithToken
     const response = await postwithToken(`${SERVER_API}/articles`, token, {
       article: {
         title: formData.title,
         description: formData.about,
         body: formData.content,
         tagList: [formData.tags],
       },
     });
    //  console.log(response.data);
     if (response.article) {
      //  console.log("Đăng bài thành công!", response.article.title);

       // Thực hiện các thao tác tiếp theo sau khi đăng bài thành công
     } else {
      //  console.error("Không có thông tin bài viết trả về từ máy chủ.");
      //  console.log(response.errors.title);
      toast("Article " + response.errors.title[0]);
     }
      // Xử lý khi đăng nhập thành công
    } catch (error) {
      // Xử lý khi đăng nhập thất bại
      console.log(error);
    }
  };

 
  return (
    <div className="container" style={{textAlign:"center"}}>
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
            placeholder="Write your article(in markdown)"
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
        {/* {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )} */}
        <button
          type="submit"
          style={{
            backgroundColor: "#5CB85C",
            color: "white",
            border: "none",
            fontSize:"18px",
            padding: "20px 30px",
            marginTop: "20px",
            borderRadius: "15px",
            
          }}
        >
          Publish Article
        </button>
      </form>
    </div>
  );
}
