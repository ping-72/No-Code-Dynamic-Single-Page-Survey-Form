import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "howitworks", label: "How It Works" },
  { id: "testimonials", label: "Testimonials" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
  { id: "cta", label: "Get Started" },
];

const Header: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  // Hide header on scroll down, show on scroll up, and update style after scrolling a bit.
  const controlHeader = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // scrolling down: hide header
      setVisible(false);
    } else {
      // scrolling up: show header
      setVisible(true);
    }
    setLastScrollY(currentScrollY);
    setScrolled(currentScrollY > 50);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`${styles.header} ${!visible ? styles.hidden : ""} ${
        scrolled ? styles.scrolled : ""
      }`}
    >
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <button
            className={styles.loginButton}
            onClick={() => (window.location.href = "/login")}
          >
            <img
              src="/images/random-face.png"
              alt="Login"
              className={styles.faceIcon}
            />
          </button>
        </div>
        <nav className={styles.nav}>
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`${styles.navLink} ${
                activeSection === sec.id ? styles.active : ""
              }`}
              onClick={() => handleNavClick(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
