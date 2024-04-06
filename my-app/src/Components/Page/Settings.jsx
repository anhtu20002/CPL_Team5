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
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Profile Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={user.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Settings</button>
      </form>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}
