import React, { useState } from "react";
import "../Assets/Login.css";
import { useNavigate } from "react-router-dom"; 
const Login = () => {
  const SERVER_API = "https://api.realworld.io/api";
  // State để lưu trữ giá trị email và password từ input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const history = useHistory();
  const navigate = useNavigate();
  // Handler khi người dùng nhập vào input email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handler khi người dùng nhập vào input password
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Hàm gửi yêu cầu đăng nhập
  const postwithToken = async (url, accessToken, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  };

  // Handler khi người dùng ấn nút đăng nhập
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gọi API đăng nhập sử dụng phương thức postwithToken
      const { user } = await postwithToken(`${SERVER_API}/users/login`, null, {
        user: {
          email,
          password,
        },
      });
      console.log(user);
      if (user === undefined) {
        console.error("Đăng nhập thất bại:");
      } else {
        console.log("Đăng nhập thành công!", user);
        console.log(user.token);
        localStorage.setItem("token", user.token);
        navigate("/HomePage");
      }
      // Xử lý khi đăng nhập thành công
    } catch (error) {
      // Xử lý khi đăng nhập thất bại
      console.log(error);      
    }
  };

  return (
    <div>
      <div className="container-login">
        <div className="container-left">
          <h2>Đăng nhập</h2>
          <p>Vui lòng nhập email và password của bạn</p>
        </div>
        <div className="container-form">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
