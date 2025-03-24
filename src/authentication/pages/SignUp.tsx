import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a unique userId
    // const _userId = uuidv4();

    // Call your backend sign-up API here passing name, email, password, userId, etc.
    // On success, backend returns a JWT token
    const fakeToken = "YOUR_JWT_TOKEN_FROM_BACKEND";
    signIn(fakeToken);
    navigate("/dashboard/home");
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email (must be unique)"
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
        <button type="submit">Sign Up</button>
      </form>
      {/* Future integration: Add Google and GitHub sign-up options */}
    </div>
  );
};

export default SignUp;
