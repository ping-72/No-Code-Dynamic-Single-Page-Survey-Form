import React from "react";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { Create, Build, Share, Assessment } from "@material-ui/icons";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    icon: <Create />,
    title: "Create Your Form",
    description:
      "Start with a blank canvas or choose from our pre-built templates. Add questions, customize fields, and set up your form structure.",
  },
  {
    icon: <Build />,
    title: "Customize & Design",
    description:
      "Personalize your form with custom colors, fonts, and layouts. Add logic jumps, validation rules, and conditional questions.",
  },
  {
    icon: <Share />,
    title: "Share & Collect",
    description:
      "Get a unique link to share your form. Embed it on your website or share via email. Start collecting responses instantly.",
  },
  {
    icon: <Assessment />,
    title: "Analyze Results",
    description:
      "View responses in real-time, generate reports, and analyze data. Export results in various formats for further analysis.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <Box className={styles.howItWorks}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <Typography variant="h2" className={styles.title}>
            How It Works
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            Create and share your survey forms in four simple steps
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box className={styles.stepCard}>
                <Box className={styles.stepNumber}>{index + 1}</Box>
                <Box className={styles.iconWrapper}>{step.icon}</Box>
                <Typography variant="h6" className={styles.stepTitle}>
                  {step.title}
                </Typography>
                <Typography variant="body1" className={styles.stepDescription}>
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
