import React from "react";
import { Box, Container, Typography, Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import styles from "./CallToActionSection.module.css";

const CallToActionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.ctaSection}>
      <Box className={styles.overlay}></Box>
      <Container maxWidth="md">
        <Box className={styles.content}>
          <Typography variant="h2" className={styles.headline}>
            Ready to Create Your Survey?
          </Typography>
          <Typography variant="h6" className={styles.subheadline}>
            Join thousands of users who are already creating dynamic,
            interactive surveys without writing a line of code.
          </Typography>
          <Box className={styles.buttonContainer}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={styles.primaryButton}
              onClick={() => navigate("/sign-up")}
            >
              Get Started Now
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

export default CallToActionSection;
