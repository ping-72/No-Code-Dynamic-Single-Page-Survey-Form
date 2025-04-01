import React from "react";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import styles from "./HeroSection.module.css";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.heroSection}>
      <Container maxWidth="lg">
        <Box className={styles.content}>
          <Typography variant="h1" className={styles.title}>
            Create Dynamic Survey Forms
            <span className={styles.highlight}> in Minutes</span>
          </Typography>
          <br />
          <Typography variant="h5" className={styles.subtitle}>
            Build, customize, and share professional survey forms with our
            intuitive drag-and-drop builder. No coding required.
          </Typography>
          <br />
          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={styles.primaryButton}
              onClick={() => navigate("/sign-up")}
            >
              Get Started Free
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              className={styles.secondaryButton}
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
