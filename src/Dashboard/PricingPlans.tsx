import React, { useEffect, useRef, useState } from "react";
import styles from "./PricingPlans.module.css";

interface PricingPlan {
  id: number;
  name: string;
  price: string;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    id: 1,
    name: "Starter",
    price: "$19/month",
    features: ["Basic survey creation", "Limited responses", "Email support"],
  },
  {
    id: 2,
    name: "Pro",
    price: "$49/month",
    features: [
      "Unlimited surveys",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
    ],
  },
];

const PricingPlans: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} className={styles.pricingSection}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${animate ? styles.animateTitle : ""}`}>
          Simple, Transparent Pricing
        </h2>
        <div className={styles.cards}>
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`${styles.card} ${animate ? styles.animateCard : ""}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.price}>{plan.price}</p>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={styles.ctaButton}
                onClick={() => (window.location.href = "/dashboard/home")}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
