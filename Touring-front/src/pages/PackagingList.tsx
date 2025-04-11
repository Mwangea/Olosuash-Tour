import { FaSuitcase, FaTshirt, FaTooth, FaCamera, FaFirstAid, FaPassport } from 'react-icons/fa';
import { GiBinoculars } from 'react-icons/gi';
import { IoIosArrowForward } from 'react-icons/io';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';


const PackagingList = () => {
  const [activeCategory, setActiveCategory] = useState('essentials');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const categories = {
    essentials: {
      title: "Essential Items",
      icon: <FaSuitcase className="text-2xl" />,
      items: [
        "Valid passport (6+ months validity)",
        "Vaccination certificates",
        "Travel insurance documents",
        "Emergency contact list",
        "Credit cards + local currency",
        "Photocopies of important documents",
        "Money belt or neck wallet"
      ]
    },
    clothing: {
      title: "Clothing",
      icon: <FaTshirt className="text-2xl" />,
      items: [
        "2-3 neutral-colored t-shirts (khaki, green, beige)",
        "1 long-sleeved safari shirt",
        "2 pairs of convertible pants/shorts",
        "Lightweight jacket or fleece",
        "Rain jacket (compact)",
        "Sturdy closed-toe shoes",
        "Sun hat with brim",
        "Bandana or scarf",
        "Long-sleeve pajamas",
        "Bathing suit"
      ]
    },
    toiletries: {
      title: "Toiletries & Health",
      icon: <FaTooth className="text-2xl" />,
      items: [
        "Prescription medications",
        "Malaria prophylaxis",
        "Insect repellent (DEET recommended)",
        "Sunscreen (SPF 30+)",
        "Lip balm with SPF",
        "Hand sanitizer",
        "Basic first aid kit",
        "Motion sickness tablets",
        "Antihistamines",
        "Rehydration salts"
      ]
    },
    gear: {
      title: "Safari Gear",
      icon: <GiBinoculars className="text-2xl" />,
      items: [
        "Binoculars (8x42 recommended)",
        "Camera with zoom lens",
        "Extra memory cards & batteries",
        "Lens cleaning kit",
        "Headlamp or flashlight",
        "Universal power adapter",
        "Dry bags for electronics",
        "Notebook/journal",
        "Field guide book"
      ]
    },
    prohibited: {
      title: "What Not to Bring",
      icon: <FaPassport className="text-2xl" />,
      items: [
        "Plastic bags (illegal in Kenya)",
        "Camouflage clothing",
        "Expensive jewelry",
        "Bright colored clothing",
        "Heavy luggage (15kg limit for flights)",
        "Hard-sided suitcases",
        "Unnecessary valuables"
      ]
    }
  };

  const faqs = [
    {
      question: "Where can I buy safari clothes?",
      answer: "You can find safari clothing at outdoor retailers like REI, Cabela's, or specialty safari stores. Many brands like Craghoppers, Columbia, and ExOfficio offer safari-appropriate clothing with UV protection and insect repellent treatments."
    },
    {
      question: "What clothes should I wear on safari in Kenya?",
      answer: "Opt for neutral-colored, lightweight, breathable clothing in khaki, green, or beige. Layers are key as temperatures vary throughout the day. Long sleeves and pants protect against sun and insects in the bush."
    },
    {
      question: "What are the best safari clothes for men/women/kids?",
      answer: "For all ages, choose quick-dry, moisture-wicking fabrics. Convertible pants, long-sleeved shirts with roll-up sleeves, and wide-brimmed hats work well. For kids, bring extra layers and sun protection."
    },
    {
      question: "What should I bring on a photo safari?",
      answer: "Essential photography gear includes a DSLR or mirrorless camera with 200-400mm zoom lens, extra batteries and memory cards, lens cleaning kit, dust-proof bag, and possibly a bean bag for stabilizing on vehicle rails."
    },
    {
      question: "Do I need binoculars on safari?",
      answer: "Yes! A good pair of binoculars (8x42 or 10x42) greatly enhances wildlife viewing. While some lodges provide them, having your own ensures they're always available when you need them."
    },
    {
      question: "What luggage restrictions apply for domestic flights?",
      answer: "Most domestic safari flights have strict 15kg (33lbs) weight limits including hand luggage, and require soft-sided bags (no hard suitcases). Pack light and consider leaving non-essentials at your Nairobi hotel."
    },
    {
      question: "What health considerations should I be aware of?",
      answer: "Consult a travel doctor 6-8 weeks before departure. Malaria prophylaxis, yellow fever vaccination (if coming from endemic areas), and routine vaccinations should be current. Bring any personal medications with copies of prescriptions."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      {/* Parallax Hero Section */}
      <div ref={ref} className="relative h-[70vh] overflow-hidden">
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 bg-[url('/zebra-pack.png')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
                Olosuashi Safari Packing Guide
              </span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Everything you need to pack for your unforgettable African adventure
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-xl p-6 mb-12"
        >
          <h2 className="text-3xl font-bold text-[#2A2A2A] font-serif mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Your Complete Packing List
            </span>
          </h2>
          <p className="text-gray-600 text-center max-w-4xl mx-auto mb-8">
            Our comprehensive packing guide ensures you bring everything you need while avoiding unnecessary items. 
            Remember to pack light - most lodges offer laundry services and you'll want space for souvenirs!
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-[#F8F4EA] rounded-xl shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 font-serif">Packing Categories</h3>
                <ul className="space-y-2">
                  {Object.keys(categories).map((key) => (
                    <li key={key}>
                      <button
                        onClick={() => setActiveCategory(key)}
                        className={`w-full text-left flex items-center justify-between py-3 px-4 rounded-lg transition ${activeCategory === key ? 'bg-[#8B6B3D] text-white' : 'bg-white text-gray-700 hover:bg-[#8B6B3D]/10'}`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{categories[key as keyof typeof categories].icon}</span>
                          {categories[key as keyof typeof categories].title}
                        </div>
                        <IoIosArrowForward className={`transition-transform ${activeCategory === key ? 'rotate-90' : ''}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="bg-[#8B6B3D] text-white p-6 flex items-center">
                  <div className="mr-4 bg-white/20 p-3 rounded-full">
                    {categories[activeCategory as keyof typeof categories].icon}
                  </div>
                  <h3 className="text-2xl font-bold font-serif">{categories[activeCategory as keyof typeof categories].title}</h3>
                </div>

                <div className="p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories[activeCategory as keyof typeof categories].items.map((item: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start py-2"
                      >
                        <span className="text-[#8B6B3D] mr-2 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {activeCategory === 'clothing' && (
                  <div className="border-t border-gray-100 p-6 bg-gray-50">
                    <h4 className="text-lg font-bold text-[#8B6B3D] mb-3">Clothing Tips</h4>
                    <div className="prose text-gray-600">
                      <p>Pack light layers for varying temperatures. Mornings and evenings can be cool while days are warm. Neutral colors (khaki, green, beige) help you blend into the environment and show less dust.</p>
                      <p className="mt-2">Most lodges offer laundry services, so you don't need to overpack. Avoid bright colors and camouflage patterns.</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Additional Tips Section */}
              <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-[#5E4B2B] text-white p-6">
                  <h3 className="text-2xl font-bold font-serif">Pro Safari Packing Tips</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-lg mr-4">
                        <FaSuitcase className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">Luggage Requirements</h4>
                        <p className="text-gray-600">Soft-sided duffel bags (max 15kg for light aircraft transfers). Pack essentials in carry-on in case of delayed luggage.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-lg mr-4">
                        <FaCamera className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">Photography Gear</h4>
                        <p className="text-gray-600">Bring extra memory cards, batteries, and a zoom lens (200-400mm ideal for wildlife). Dust-proof your equipment.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-lg mr-4">
                        <FaFirstAid className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">Health Essentials</h4>
                        <p className="text-gray-600">Pack personal medications, malaria prophylaxis, sunscreen, insect repellent, and basic first aid supplies.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-lg mr-4">
                        <FaPassport className="text-xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2">Travel Documents</h4>
                        <p className="text-gray-600">Passport (6+ months validity), vaccination certificates, travel insurance, emergency contacts, and copies of all documents.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-[#8B6B3D] text-white p-6">
            <h3 className="text-2xl font-bold font-serif">Safari Packing FAQs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-[#8B6B3D] transition"
                  >
                    <span className="text-lg">{faq.question}</span>
                    <IoIosArrowForward className={`transform transition-transform ${openFaq === index ? 'rotate-90' : ''}`} />
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagingList;