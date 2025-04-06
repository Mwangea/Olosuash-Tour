import HeroSlider from "../components/HeroSlider";
import FeaturedSection from "../components/FeaturedSection";
import UniqueSafariSection from "../components/UniqueSafariSection";
import TourCategories from "../components/TourCategories";
import WhyChooseUs from "../components/WhyChooseUs";
import PopularDestinations from "../components/PopularDestinations";
import SpecialOffers from "../components/SpecialOffers";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import FinalCTA from "../components/FinalCTA";


const Home = () => {
  return (
    <div className="overflow-hidden">
      <HeroSlider />
      <FeaturedSection />
      <UniqueSafariSection />
      <TourCategories />
      <WhyChooseUs />
      <PopularDestinations />
      <SpecialOffers />
      <Testimonials />
      <Newsletter />
      <FinalCTA />
    </div>
  );
};

export default Home;