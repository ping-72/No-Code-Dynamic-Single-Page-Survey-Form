import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../../config/api";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  GitHub,
  AccountCircle,
} from "@material-ui/icons";
import styles from "./SignUp.module.css";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className={styles.root}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} className={styles.paper}>
          <Box className={styles.header}>
            <Typography component="h1" variant="h4" className={styles.title}>
              Create Account
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={styles.subtitle}
            >
              Join Form Builder to create amazing forms
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              helperText="Must be at least 3 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              helperText="Must be at least 6 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                className={styles.error}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={styles.submit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}
            </Button>

            <Box className={styles.divider}>
              <Typography variant="body2" color="textSecondary">
                Or continue with
              </Typography>
            </Box>

            <Box className={styles.socialButtons}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AccountCircle />}
                className={styles.socialButton}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                className={styles.socialButton}
              >
                GitHub
              </Button>
            </Box>

            <Box className={styles.footer}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/sign-in")}
                  className={styles.link}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
