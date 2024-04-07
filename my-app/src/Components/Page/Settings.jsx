import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings({ setAuthStatus }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    bio: "",
    image: "",
  });
  const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

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
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthStatus("UNAUTHENTICATED");
    navigate("/login");
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.id]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Implement form validation (optional)
    // if (!isValidForm()) {
    //   return;
    // }

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

      // Check if email or password changed
      const isEmailChanged = user.email !== updatedData.user.email;
      const isPasswordChanged = user.password !== updatedData.user.password;

      if (isEmailChanged || isPasswordChanged) {
        alert("Email or password successfully updated. Please log in again.");
        localStorage.removeItem("token"); // Remove token for security
        setAuthStatus("UNAUTHENTICATED");
        navigate("/login");
      } else {
        console.log("Other user settings updated successfully!"); // Or display a success message
      }
    } catch (error) {
      console.error("Error updating user settings:", error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-center">Settings</h1>
            <form onSubmit={handleSubmit}>
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
              <button type="submit">Update Settings</button>
            </form>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
