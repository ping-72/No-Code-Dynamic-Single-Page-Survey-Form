import HeroSection from "../HeroSection";
import FeaturesSection from "../FeaturesSection";
import HowItWorks from "../HowItWorks";
import TestimonialsSection from "../TestimonialsSection";
import PricingPlans from "../PricingPlans";
import FAQSection from "../FAQSection";
import Footer from "../Footer";
import CallToActionSection from "../CallToActionSection";
import ContactSection from "../ContactSection";
// import Header from "./Header";

const Dashboard: React.FC = () => {
  return (
    <div style={{ width: "100%" }}>
      {/* <Header /> */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingPlans />
      <FAQSection />
      <ContactSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default Dashboard;
