import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { UserData } from "../../interface/User";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call your backend sign-in API here and receive a JWT token
    // For demo purposes, assume we get a token from backend
    // Sign-in user Info is got to the backend -> backend checks and returns a JWT token -> then the token is stored in the local storage -> then the user is redirected to the dashboard

    // const sentUserData = { email, password };
    // const returnedUserData: UserData = {
    //   userId: "uniqueUserId",
    //   name: "User Name",
    //   email: email,
    //   photo: "https://example.com/photo.jpg",
    //   token: "sampleToken",
    //   exp: Math.floor(Date.now() / 1000) + 3600, // Current time + 1 hour
    // };

    const fakeToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzM1MmU3MzU2NjgzNjY1MjMiLCJpYXQiOjE2NzI1NjQ4NzUsImV4cCI6MTY3MjY1MTY3NX0.6h2a3s5H3p3o8N7K6c4b3a2b1"; // Replace with a valid JWT token
    signIn(fakeToken);
    navigate(from, { replace: true });
  };

  return (
    <div>
      <h1>Sign In</h1>
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
      {/* Future integration: Add Google and GitHub buttons */}
    </div>
  );
};

export default SignIn;
