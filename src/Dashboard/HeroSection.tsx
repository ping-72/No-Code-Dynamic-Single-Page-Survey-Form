import React, { useEffect, useState } from "react";
import styles from "./HeroSection.module.css";

const HeroSection: React.FC = () => {
  // Local state to trigger animations on mount
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimate(true);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={`${styles.headline} ${animate ? styles.animateIn : ""}`}>
          Build Powerful Surveys Without Coding
        </h1>
        <p
          className={`${styles.subheadline} ${
            animate ? styles.animateInDelay : ""
          }`}
        >
          Easily create, customize, and deploy dynamic survey forms with a
          drag-and-drop interface.
        </p>
        <button
          className={`${styles.ctaButton} ${animate ? styles.ctaAnimate : ""}`}
          onClick={() => {
            // Replace with your sign-up action or navigation
            window.location.href = "/signup";
          }}
        >
          Try for Free
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
