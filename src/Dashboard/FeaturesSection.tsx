import React, { useEffect, useRef, useState } from "react";
import styles from "./FeaturesSection.module.css";

// Dummy data for feature cards – replace with your own assets and text as needed.
const features = [
  {
    id: 1,
    icon: "/icons/drag-drop.svg", // Path to your flat-design icon
    title: "Drag-and-Drop Editor",
    description:
      "Effortlessly build your survey with an intuitive drag-and-drop interface.",
  },
  {
    id: 2,
    icon: "/icons/dynamic-logic.svg",
    title: "Dynamic Dependencies",
    description:
      "Show or hide questions based on previous answers for a personalized experience.",
  },
  {
    id: 3,
    icon: "/icons/real-time-preview.svg",
    title: "Real-Time Preview",
    description:
      "See your changes live as you create and customize your survey.",
  },
  // Additional feature objects can be added here
];

const FeaturesSection: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            observer.disconnect(); // Disconnect after animation triggers
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${animate ? styles.fadeInLeft : ""}`}>
          Key Features
        </h2>
        <p
          className={`${styles.subtitle} ${animate ? styles.fadeInDelay : ""}`}
        >
          Empower your team with easy-to-use survey tools that drive insights.
        </p>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`${styles.card} ${animate ? styles.popIn : ""}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className={styles.icon}
              />
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
