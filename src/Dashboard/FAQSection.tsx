import React, { useEffect, useRef, useState } from "react";
import styles from "./FAQSection.module.css";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "How does the survey builder work?",
    answer:
      "Our survey builder uses a drag-and-drop interface that lets you easily create and customize your surveys. You can add various question types and set up dynamic dependencies without writing any code.",
  },
  {
    id: 2,
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a free trial period so you can explore all features of our platform before deciding on a subscription plan.",
  },
  {
    id: 3,
    question: "Can I customize the look and feel of my survey?",
    answer:
      "Absolutely. Our platform allows for custom branding, so you can match your surveys with your company’s style and colors.",
  },
  // Add more FAQs as needed...
];

const FAQSection: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (id: number) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section ref={sectionRef} className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${animate ? styles.animateTitle : ""}`}>
          Frequently Asked Questions
        </h2>
        <div className={styles.faqList}>
          {faqItems.map((item) => (
            <div key={item.id} className={styles.faqItem}>
              <button
                className={styles.question}
                onClick={() => toggleFAQ(item.id)}
              >
                {item.question}
                <span
                  className={`${styles.chevron} ${
                    activeId === item.id ? styles.chevronOpen : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`${styles.answerWrapper} ${
                  activeId === item.id ? styles.answerOpen : ""
                }`}
              >
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
