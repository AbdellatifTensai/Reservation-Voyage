import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/LoginService";
import LoginView from "../view/LoginView";

export default function LoginController() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "user") {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <LoginView
      username={username}
      password={password}
      error={error}
      setUsername={setUsername}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
}