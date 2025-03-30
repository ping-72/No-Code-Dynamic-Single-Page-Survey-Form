import React, { useState } from "react";
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
  GitHub,
  AccountCircle,
} from "@material-ui/icons";
import styles from "./SignIn.module.css";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState<SignInFormData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      signIn(token);

      navigate(`/${userId}/dashboard/home`, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in. Please try again.");
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className={styles.subtitle}
            >
              Sign in to continue to Form Builder
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
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
                "Sign In"
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
                Don't have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/sign-up")}
                  className={styles.link}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;
