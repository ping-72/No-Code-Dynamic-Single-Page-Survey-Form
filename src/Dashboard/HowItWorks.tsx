import React, { useEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Create Your Survey",
    description:
      "Use our intuitive editor to build your survey structure with just a few clicks.",
    icon: "/icons/create.svg", // Replace with the actual path to your icon
  },
  {
    id: 2,
    title: "Customize with Intuitive Tools",
    description:
      "Easily adjust question types, add logic, and manage dependencies.",
    icon: "/icons/customize.svg",
  },
  {
    id: 3,
    title: "Launch & Collect Responses",
    description:
      "Deploy your survey instantly and track responses in real-time.",
    icon: "/icons/launch.svg",
  },
];

const HowItWorks: React.FC = () => {
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
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.howItWorks}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${animate ? styles.animateTitle : ""}`}>
          How It Works
        </h2>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.step} ${animate ? styles.animateStep : ""}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <img
                src={step.icon}
                alt={step.title}
                className={styles.stepIcon}
              />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
