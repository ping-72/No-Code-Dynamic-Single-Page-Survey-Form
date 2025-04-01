import React from "react";
import { Box, Container, Grid, Typography, Link } from "@material-ui/core";
import { Facebook, Twitter, LinkedIn, Instagram } from "@material-ui/icons";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box className={styles.footer}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className={styles.footerTitle}>
              Form Builder
            </Typography>
            <Typography variant="body1" className={styles.footerDescription}>
              Create dynamic, interactive survey forms with our powerful form
              builder. No coding required.
            </Typography>
            <Box className={styles.socialLinks}>
              <Link href="#" className={styles.socialLink}>
                <Facebook />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <Twitter />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <LinkedIn />
              </Link>
              <Link href="#" className={styles.socialLink}>
                <Instagram />
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.footerTitle}>
              Product
            </Typography>
            <ul className={styles.footerList}>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Pricing
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.footerTitle}>
              Resources
            </Typography>
            <ul className={styles.footerList}>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Blog
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.footerTitle}>
              Company
            </Typography>
            <ul className={styles.footerList}>
              <li>
                <Link href="#" className={styles.footerLink}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Contact
                </Link>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" className={styles.footerTitle}>
              Legal
            </Typography>
            <ul className={styles.footerList}>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className={styles.footerLink}>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>

        <Box className={styles.bottomBar}>
          <Typography variant="body2" className={styles.copyright}>
            © {currentYear} Form Builder. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
