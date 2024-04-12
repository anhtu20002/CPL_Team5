import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Signup = ({ setAuthStatus }) => {
  const SERVER_API = "https://api.realworld.io/api";
  const [formData, setFormData] = useState({
    username: "viet1",
    email: "viet1@gmail.com",
    password: "123456",
  });
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData);

  const postwithToken = async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    console.log(JSON.stringify(data));
    console.log(data);
    return response.json();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gọi API đăng ký sử dụng phương thức postwithToken
      const response = await postwithToken(`${SERVER_API}/users`, {
        user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });
      // Kiểm tra xem yêu cầu đã được thực hiện thành công hay không
      if (response.user) {
        // Nếu thành công, chuyển hướng đến trang chính
        // navigate("/");
        console.log(response.user);
        localStorage.setItem("token", response.user.token);
        setAuthStatus("AUTHENTICATED"); // Update authStatus
        navigate("/");
      } else {
        // Nếu không thành công, xử lý lỗi từ server
        // const errorMessage = await response.text();
        // throw new Error(errorMessage);
        if (response.errors.email && response.errors.email[0]) {
          toast.error("Email " + response.errors.email[0]);
        }
        if (response.errors.username && response.errors.username[0]) {
          toast.error("Username " + response.errors.username[0]);
        }
          console.error("Không có thông tin bài viết trả về từ máy chủ.");
        console.log(response.errors.email[0]);
        console.log(response.errors.username[0]);
      }
    } catch (error) {
      // Xử lý lỗi từ phía client hoặc server
      console.error("Đăng ký thất bại:", error);
      // alert("Đã xảy ra lỗi khi đăng ký.");
    }
  };

  return (
    <div>
      <div className="container-login">
        <div className="container-left">
          <h2>Sign Up</h2>
          {/* <p>Vui lòng nhập thông tin của bạn</p> */}
          <p
            style={{
              color: "#5CB85C",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "#5CB85C",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Have An Account?
            </Link>
          </p>
        </div>
        <div className="container-form" style={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              style={{
                float: "right",
                borderRadius: "5px",
                fontSize: "1.2rem",
                marginTop: "5px",
              }}
              type="submit"
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;
