import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";

interface SignUpFormData {
  username: string; // Must be at least 3 characters
  email: string;
  password: string; // Must be at least 6 characters
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post("/auth/register", formData);
      const { token, userId } = response.data;

      // Store token and sign in the user
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      signIn(token);

      // Redirect to the dashboard with userId in the path
      navigate(`/${userId}/dashboard/home`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign up. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username (min 3 characters)"
          value={formData.username}
          onChange={handleChange}
          required
          minLength={3}
        />
        <input
          type="email"
          name="email"
          placeholder="Email (must be unique)"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <button onClick={() => navigate("/sign-in")}>Sign In</button>
      </p>
      {/* Future integration: Add Google and GitHub sign-up options */}
    </div>
  );
};

export default SignUp;
