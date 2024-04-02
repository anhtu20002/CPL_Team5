import React from "react";
import { useNavigate } from "react-router-dom"; // Importing necessary dependency

export default function Settings({ setAuthStatus }) {
  const navigate = useNavigate(); // Initializing the navigate function

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setAuthStatus("UNAUTHENTICATED");
    navigate("/login"); // Redirect user to login page after logout
  };

  return (
    <div>
      <h2>Settings</h2>
      {/* Logout button */}
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
}
