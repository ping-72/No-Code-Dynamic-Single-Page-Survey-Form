import React, { useEffect, useRef, useState } from "react";
import styles from "./CallToActionSection.module.css";

const CallToActionSection: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.ctaSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={`${styles.headline} ${animate ? styles.animateIn : ""}`}>
          Ready to Build Your Survey?
        </h2>
        <p
          className={`${styles.subheadline} ${
            animate ? styles.animateInDelay : ""
          }`}
        >
          Join thousands of users who are already creating dynamic, interactive
          surveys without writing a line of code.
        </p>
        <button
          className={`${styles.ctaButton} ${animate ? styles.ctaAnimate : ""}`}
          onClick={() => (window.location.href = "/signup")}
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};

export default CallToActionSection;
