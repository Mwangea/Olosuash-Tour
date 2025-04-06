import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The best safari experience we've ever had! Our guide was incredibly knowledgeable and we saw all the Big Five.",
      author: "Sarah & Mark, USA",
      rating: 5
    },
    {
      quote: "Everything was perfectly organized from start to finish. We'll definitely be booking with Olosuashi again.",
      author: "The Johnson Family, UK",
      rating: 5
    },
    {
      quote: "An unforgettable honeymoon thanks to the amazing team. The luxury tented camp was beyond our expectations.",
      author: "James & Emily, Australia",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="py-16 bg-gradient-to-b from-[#E9F5FF] to-[#F0F7F0]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-serif">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
            What Our Guests Say
          </span>
        </h2>
        
        {/* Mobile - Carousel (single testimonial) */}
        <div className="md:hidden">
          <div 
            key={currentTestimonial}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#8B6B3D]/30"
          >
            <div className="flex mb-4 text-yellow-400">
              {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <blockquote className="text-gray-600 italic mb-6 text-lg">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            <p className="font-medium text-gray-800">— {testimonials[currentTestimonial].author}</p>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${currentTestimonial === index ? 'bg-[#8B6B3D]' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Desktop - Grid (all testimonials) */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#8B6B3D]/30"
            >
              <div className="flex mb-4 text-yellow-400">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <blockquote className="text-gray-600 italic mb-6 text-lg">
                "{testimonial.quote}"
              </blockquote>
              <p className="font-medium text-gray-800">— {testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;