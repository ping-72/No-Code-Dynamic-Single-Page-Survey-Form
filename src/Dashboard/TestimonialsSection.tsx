import React, { useEffect, useRef, useState } from "react";
import styles from "./TestimonialsSection.module.css";

interface Testimonial {
  id: number;
  quote: string;
  customer: string;
  company: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "This tool revolutionized the way we collect feedback – it's intuitive and powerful!",
    customer: "Jane Doe",
    company: "Acme Corp",
    image: "/images/jane-doe.jpg",
  },
  {
    id: 2,
    quote:
      "Our survey response rates skyrocketed after we started using this platform.",
    customer: "John Smith",
    company: "Beta Inc",
    image: "/images/john-smith.jpg",
  },
  {
    id: 3,
    quote: "A game-changer for our HR team – so easy to use!",
    customer: "Alice Johnson",
    company: "Gamma Ltd",
    image: "/images/alice-johnson.jpg",
  },
  {
    id: 4,
    quote: "The customer support is excellent and very responsive.",
    customer: "Bob Lee",
    company: "Delta Co",
    image: "/images/bob-lee.jpg",
  },
  {
    id: 5,
    quote: "Our productivity increased significantly after adopting this tool.",
    customer: "Catherine Green",
    company: "Epsilon Enterprises",
    image: "/images/catherine-green.jpg",
  },
];

const TestimonialsCarousel: React.FC = () => {
  // Active testimonial index
  const [activeIndex, setActiveIndex] = useState(0);
  // Reference to the auto-scroll timer
  const intervalRef = useRef<number | null>(null);
  // Reference to the carousel container (for hover events)
  const carouselRef = useRef<HTMLDivElement>(null);

  // Start auto-scroll timer
  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000); // Change testimonial every 3 seconds
  };

  // Stop auto-scroll timer
  const stopAutoScroll = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div
        className={styles.carousel}
        ref={carouselRef}
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <div
          className={styles.carouselInner}
          style={{
            transform: `translateX(-${activeIndex * 320}px)`,
            transition: "transform 0.5s ease-out",
          }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.card}>
              <img
                src={testimonial.image}
                alt={testimonial.customer}
                className={styles.avatar}
              />
              <p className={styles.quote}>"{testimonial.quote}"</p>
              <p className={styles.customer}>
                — {testimonial.customer}, {testimonial.company}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.pagination}>
        {testimonials.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === activeIndex ? styles.activeDot : ""
            }`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
