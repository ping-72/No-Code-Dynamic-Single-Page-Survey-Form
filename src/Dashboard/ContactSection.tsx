import React, { useEffect, useRef, useState } from "react";
import styles from "./ContactSection.module.css";

const ContactSection: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your submission logic here
    console.log("Contact form submitted:", { name, email, message });
  };

  return (
    <section ref={sectionRef} className={styles.contactSection}>
      <div className={styles.overlay}></div>
      <div className={styles.container}>
        <h2 className={`${styles.title} ${animate ? styles.animateIn : ""}`}>
          Get in Touch
        </h2>
        <p
          className={`${styles.subtitle} ${
            animate ? styles.animateInDelay : ""
          }`}
        >
          Have a question or want to learn more? Drop us a message!
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${styles.input} ${
              animate ? styles.animateInDelay : ""
            }`}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${styles.input} ${
              animate ? styles.animateInDelay : ""
            }`}
            required
          />
          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${styles.textarea} ${
              animate ? styles.animateInDelay : ""
            }`}
            rows={5}
            required
          />
          <button
            type="submit"
            className={`${styles.submitButton} ${
              animate ? styles.animateButton : ""
            }`}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
