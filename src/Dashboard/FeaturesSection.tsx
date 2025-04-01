import React from "react";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import {
  Assessment,
  Build,
  Security,
  Speed,
  Assessment as Analytics,
  Devices,
} from "@material-ui/icons";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: <Assessment />,
    title: "Dynamic Forms",
    description:
      "Create interactive forms that adapt based on user responses. Add conditional logic, skip patterns, and branching questions.",
  },
  {
    icon: <Build />,
    title: "Easy Customization",
    description:
      "Customize every aspect of your forms with our intuitive builder. Choose from multiple themes, layouts, and question types.",
  },
  {
    icon: <Security />,
    title: "Secure & Private",
    description:
      "Your data is protected with enterprise-grade security. All responses are encrypted and stored securely in the cloud.",
  },
  {
    icon: <Speed />,
    title: "Real-time Responses",
    description:
      "Get instant notifications when responses come in. View and analyze data in real-time with our powerful dashboard.",
  },
  {
    icon: <Analytics />,
    title: "Advanced Analytics",
    description:
      "Generate detailed reports, visualize data with charts, and export results in multiple formats for further analysis.",
  },
  {
    icon: <Devices />,
    title: "Mobile Friendly",
    description:
      "Forms look great and work perfectly on all devices. Collect responses from desktop, tablet, or mobile users.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box className={styles.featuresSection}>
      <Container maxWidth="lg">
        <Box className={styles.header}>
          <Typography variant="h2" className={styles.title}>
            Powerful Features
          </Typography>
          <Typography variant="h6" className={styles.subtitle}>
            Everything you need to create professional survey forms
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box className={styles.featureCard}>
                <Box className={styles.iconWrapper}>{feature.icon}</Box>
                <Typography variant="h6" className={styles.featureTitle}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  className={styles.featureDescription}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
