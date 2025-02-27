import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <a href="/" className={styles.link}>
            Home
          </a>
          <a href="/features" className={styles.link}>
            Features
          </a>
          <a href="/pricing" className={styles.link}>
            Pricing
          </a>
          <a href="/about" className={styles.link}>
            About
          </a>
          <a href="/contact" className={styles.link}>
            Contact
          </a>
        </nav>
        <div className={styles.social}>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <img src="/icons/twitter.svg" alt="Twitter" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <img src="/icons/facebook.svg" alt="Facebook" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <img src="/icons/linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
        <div className={styles.legal}>
          © 2025 Survey Builder. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
