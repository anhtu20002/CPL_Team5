import React , { useState} from 'react';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const SERVER_API = "https://api.realworld.io/api";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
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
       body: data,
     });
     console.log(data);
     return response.json();
   };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gọi API đăng ký sử dụng phương thức postwithToken
      const response = await postwithToken(`${SERVER_API}/users`, {
        users:formData
      });
      // Kiểm tra xem yêu cầu đã được thực hiện thành công hay không
      if (response.ok) {
        // Nếu thành công, chuyển hướng đến trang chính
        navigate("/");
      } else {
        // Nếu không thành công, xử lý lỗi từ server
        // const errorMessage = await response.text();
        // throw new Error(errorMessage);
        console.log("lỗi");
      }
    } catch (error) {
      // Xử lý lỗi từ phía client hoặc server
      console.error("Đăng ký thất bại:", error);
      alert("Đã xảy ra lỗi khi đăng ký.");
    }
  };

  return (
    <div>
      <div className="container-login">
        <div className="container-left">
          <h2>Đăng kí</h2>
          <p>Vui lòng nhập thông tin của bạn</p>
        </div>
        <div className="container-form">
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Signup;