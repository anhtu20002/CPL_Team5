import React, { useState } from "react";
import "../Assets/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { useHistory } from "react-router-dom";
const Login = ({ setAuthStatus }) => {
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
        console.error("Đăng nhập thất bại");
        toast("Email or password is invalid");
        console.log(user.errors);
      } else {
        console.log("Đăng nhập thành công!", user);
        console.log(user.token);
        localStorage.setItem("token", user.token);
        localStorage.setItem("username", user.username);
        localStorage.setItem("image", user.image);
        setAuthStatus("AUTHENTICATED"); // Update authStatus
        navigate("/");
        // history.push("/")
      }
      // Xử lý khi đăng nhập thành công
      console.log(user.token);
    } catch (error) {
      // Xử lý khi đăng nhập thất bại
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="container-login"
        style={{
          height: "82vh",
        }}
      >
        <div className="container-left">
          <h2>Sign In</h2>
          <p
            style={{
              color: "#5CB85C",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            <Link
              to="/register"
              style={{
                color: "#5CB85C",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Need An Account
            </Link>
          </p>
        </div>
        <div className="container-form" style={{textAlign:"center"}}>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              {/* <label htmlFor="exampleInputEmail1">Email address</label> */}
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
            </div>
            <div className="form-group">
              {/* <label htmlFor="exampleInputPassword1">Password</label> */}
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
            <button
              type="submit"
              
              // style={{ color: "#5CB85C" }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
