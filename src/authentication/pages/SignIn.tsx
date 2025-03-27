import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, userId } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      signIn(token);

      // Redirect to the dashboard with userId in the path
      navigate(`/${userId}/dashboard/home`, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{" "}
        <button onClick={() => navigate("/sign-up")}>Sign Up</button>
      </p>
      {/* Future integration: Add Google and GitHub buttons */}
    </div>
  );
};

export default SignIn;
