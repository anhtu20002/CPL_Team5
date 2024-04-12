import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.css";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";

export default function Settings({ setAuthStatus }) {
  const [isloading, setIsLoading] = useState(true);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [previousUserData, setPreviousUserData] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    bio: "",
    image: "",
  });
  const token = localStorage.getItem("token"); 

  //get user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://api.realworld.io/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUser({ ...data.user });
        setPreviousUserData({ ...data.user });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, isUpdateSuccess]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthStatus("UNAUTHENTICATED");
    navigate("/login");
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      const response = await fetch(`https://api.realworld.io/api/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user settings");
      }

      const updatedData = await response.json();
      setUser(updatedData.user); // Update local state with updated data
      setIsUpdateSuccess(true);

      // Check if email or password changed
      const isEmailChanged = previousUserData.email !== updatedData.user.email;
      const isPasswordChanged = user.password !== updatedData.user.password;

      if (isEmailChanged || isPasswordChanged) {
        toast.success(
          "Email or password successfully updated! Please log in again."
        );
        localStorage.removeItem("token");
        setAuthStatus("UNAUTHENTICATED");
        navigate("/login");
      } 
      
    } catch (error) {
      console.error("Error updating user settings:", error);
      toast.error("Email or Username already exists");
      setIsUpdateSuccess(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-center fw-normal">Your Settings</h1>
            {isloading ? (
              <div
                style={{ margin: "auto", width: "1%", paddingRight: "30px" }}
              >
                <Spinner animation="border" variant="success" />
              </div>
            ) : (
              <div>
                {" "}
                <div className="container d-flex justify-content-center mb-3">
                  <form
                    onSubmit={handleSubmit}
                    style={{ borderBottom: "1px solid #e5e5e5" }}
                  >
                    <fieldset>
                      <fieldset className="mb-3 mx-auto">
                        <input
                          className="form-control mx-0"
                          type="text"
                          id="image"
                          name="image"
                          value={user.image}
                          onChange={handleChange}
                          placeholder="URL of picture profile"
                        />
                      </fieldset>
                      <fieldset className="mb-3">
                        <input
                          className="form-control form-control-lg"
                          type="text"
                          id="username"
                          name="username"
                          value={user.username}
                          onChange={handleChange}
                          placeholder="Your Name"
                        />
                      </fieldset>
                      <fieldset className="mb-3">
                        <textarea
                          rows={8}
                          className="form-control form-control-lg"
                          type="text"
                          id="bio"
                          name="bio"
                          value={user.bio}
                          onChange={handleChange}
                          placeholder="Short bio about you"
                        />
                      </fieldset>
                      <fieldset className="mb-3">
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          id="email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                          placeholder="Email"
                        />
                      </fieldset>
                      <fieldset className="mb-3">
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          id="password"
                          name="password"
                          value={user.password}
                          onChange={handleChange}
                          placeholder="Password"
                        />
                      </fieldset>
                      <div>
                        {!isUpdateSuccess ? (
                          ""
                        ) : (
                          <span
                            className="text-success"
                            style={{ float: "left" }}
                          >
                            Update settings successfully
                          </span>
                        )}
                        <button
                          className={`${styles.upd_btn} btn btn-lg mb-3`}
                          type="submit"
                        >
                          Update Settings
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </div>
              </div>
            )}
            <div>
              <button
                onClick={handleLogout}
                className={`btn ${styles.btn_logout}`}
                style={{ float: "left" }}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
