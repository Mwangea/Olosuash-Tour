/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { FaSearch, FaCheck, FaClock, FaShieldAlt, FaPhone, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { GiClothes, GiCampingTent, GiWalkingBoot, GiHiking, GiMountainClimbing } from "react-icons/gi";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { Calendar, CreditCard, DollarSign, HandshakeIcon, Package, PackageOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const EquipmentRental = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const rentalItems = [
    {
      id: 1,
      name: "4-Season Mountain Tent",
      image: "/4-season.jpg",
      category: "Camping",
      price: 25,
      priceUnit: "day",
      deposit: 100,
      icon: <GiCampingTent className="text-3xl text-[#8B6B3D]" />,
      features: [
        "Sleeps 2-3 people",
        "Wind-resistant design",
        "Includes rainfly & footprint"
      ],
      popular: true
    },
    {
      id: 2,
      name: "Mountaineering Boots",
      image: "/mountain-boots.jpg",
      category: "Footwear",
      price: 15,
      priceUnit: "day",
      deposit: 75,
      icon: <GiHiking className="text-3xl text-[#8B6B3D]" />,
      features: [
        "Insulated for cold conditions",
        "Vibram soles for traction",
        "Sizes 36-46 available"
      ],
      popular: true
    },
    {
      id: 3,
      name: "Climbing Harness",
      image: "/climbing.jpg",
      category: "Safety",
      price: 10,
      priceUnit: "day",
      deposit: 50,
      icon: <GiMountainClimbing className="text-3xl text-[#8B6B3D]" />,
      features: [
        "UIAA certified",
        "Adjustable leg loops",
        "Includes gear loops"
      ]
    },
    {
      id: 4,
      name: "Down Jacket (-20°C)",
      image: "/down-jacket.jpg",
      category: "Clothing",
      price: 12,
      priceUnit: "day",
      deposit: 60,
      icon: <GiClothes className="text-3xl text-[#8B6B3D]" />,
      features: [
        "800-fill power down",
        "Water-resistant shell",
        "Sizes S-XXL available"
      ]
    },
    {
      id: 5,
      name: "Trekking Poles (Pair)",
      image: "/trecking.jpg",
      category: "Accessories",
      price: 8,
      priceUnit: "day",
      deposit: 40,
      icon: <GiWalkingBoot className="text-3xl text-[#8B6B3D]" />,
      features: [
        "Carbon fiber construction",
        "Shock absorption",
        "Adjustable height"
      ]
    },
    {
      id: 6,
      name: "Winter Sleeping Bag",
      image: "/sleeping-bag.jpg",
      category: "Camping",
      price: 18,
      priceUnit: "day",
      deposit: 90,
      icon: <GiCampingTent className="text-3xl text-[#8B6B3D]" />,
      features: [
        "Comfort rating -15°C",
        "Lightweight compressible",
        "Includes storage sack"
      ],
      popular: true
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Browse & Select",
      description: "Find the perfect gear",
      icons: [<Search size={24} />]
    },
    {
      number: 2,
      title: "Reserve Online",
      description: "Book & pay securely",
      icons: [<Calendar size={24} />, <CreditCard size={24} />]
    },
    {
      number: 3,
      title: "Pick Up Gear",
      description: "Quick & easy retrieval",
      icons: [<Package size={24} />, <HandshakeIcon size={24} />]
    },
    {
      number: 4,
      title: "Return & Refund",
      description: "Simple returns process",
      icons: [<PackageOpen size={24} />, <DollarSign size={24} />]
    }
  ];


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = ['All', ...new Set(rentalItems.map(item => item.category))];

  const filteredItems = rentalItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (id: number) => {
    setCartItems(prev => [...prev, id]);
    toast.success('Item added to cart!');
  };

  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        {/* Hero Section with Image */}
        <div className="relative h-[50vh] mb-5 overflow-hidden rounded-xl">
        <motion.div 
          className="absolute inset-0 bg-[url('/rental-hero.jpg')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
              Premium Mountain Equipment Rental
              </span>
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-6">
            High-quality gear for your mountain adventures at affordable rates
            </p>
            <Link 
                to="#rental-items" 
                className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center"
              >
                Browse Equipment <FaArrowRight className="ml-2" />
              </Link>

          </motion.div>
        </div>
      </div>

        {/* Search & Filter */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search equipment..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
            title='select'
              className="block w-full md:w-auto pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-[#8B6B3D] focus:border-[#8B6B3D]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rental Benefits */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Why Rent With Olosuashi?
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaCheck className="text-2xl text-[#8B6B3D]" />,
                title: "Premium Quality Gear",
                description: "All equipment is professionally maintained and inspected before each rental"
              },
              {
                icon: <FaClock className="text-2xl text-[#8B6B3D]" />,
                title: "Flexible Rental Periods",
                description: "Daily, weekly, or custom rental periods to suit your trip duration"
              },
              {
                icon: <FaShieldAlt className="text-2xl text-[#8B6B3D]" />,
                title: "Damage Protection",
                description: "Optional low-cost damage waiver available for peace of mind"
              }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-[#8B6B3D]/10 p-2 rounded-full mr-4">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rental Items Grid */}
<div className="mb-12" id="rental-items">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 font-serif">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
        Available Equipment
      </span>
    </h2>
    <div className="text-sm text-gray-600">
      Showing {filteredItems.length} of {rentalItems.length} items
    </div>
  </div>
  
  {filteredItems.length === 0 ? (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
      <p className="text-gray-600 mb-4">No equipment matches your search criteria</p>
      <button 
        onClick={() => {
          setSearchTerm('');
          setSelectedCategory('All');
        }}
        className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium"
      >
        Clear filters
      </button>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          {/* Image with badge */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="absolute w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            {item.popular && (
              <span className="absolute top-2 right-2 bg-[#8B6B3D] text-white text-xs px-2 py-1 rounded">
                Popular
              </span>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="bg-[#8B6B3D]/10 p-2 rounded-full">
                {item.icon}
              </div>
              <span className="bg-[#8B6B3D]/10 text-[#8B6B3D] text-xs px-2 py-1 rounded">
                {item.category}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
            
            {/* Features list */}
            <ul className="space-y-2 mb-4 text-gray-600 text-sm">
              {item.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Price and CTA */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="font-bold text-lg text-[#8B6B3D]">${item.price}/{item.priceUnit}</p>
                <p className="text-xs text-gray-500">Deposit: ${item.deposit}</p>
              </div>
              <button 
                onClick={() => addToCart(item.id)}
                disabled={cartItems.includes(item.id)}
                className={`bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-4 py-2 rounded-md text-sm font-medium transition ${
                  cartItems.includes(item.id) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {cartItems.includes(item.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        {/* Equipment Visualization */}
        <div className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Complete Equipment Packages
            </span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/equipment-visual.webp" 
                alt="Complete mountain climbing equipment set displayed on a table" 
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                We Offer Complete Kits For:
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Basic Hiking:</strong> Day packs, poles, hydration systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Alpine Climbing:</strong> Ice axes, crampons, helmets, harnesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#8B6B3D] mr-2">•</span>
                  <span><strong>Expedition Gear:</strong> High-altitude tents, -40°C sleeping bags, cooking systems</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link 
                  to="/contact" 
                  className="inline-flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] font-medium"
                >
                  <FaEnvelope className="mr-2" />
                  Request a Custom Package Quote
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Process Visual */}
        <div className="mb-16 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
          Simple Rental Process
        </span>
      </h2>
      
      <div className="flex flex-col md:flex-row w-full">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 flex-col items-center mb-8 md:mb-0 relative">
            {/* Step Number Circle */}
            <div className="w-16 h-16 rounded-full bg-[#8B6B3D] flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">{step.number}</span>
            </div>
            
            {/* Icons */}
            <div className="flex space-x-2 mb-3">
              {step.icons.map((icon, i) => (
                <div key={i} className="w-10 h-10 flex items-center justify-center text-[#5E4B2B]">
                  {icon}
                </div>
              ))}
            </div>
            
            {/* Title & Description */}
            <h3 className="font-bold text-[#5E4B2B] text-lg mb-1 text-center">{step.title}</h3>
            <p className="text-sm text-[#5E4B2B] text-center">{step.description}</p>
            
            {/* Connector Arrow (except for last item) */}
            {index < steps.length - 1 && (
              <>
                {/* Arrow for desktop (horizontal) */}
                <div className="hidden md:flex absolute -right-3 top-16 items-center justify-center">
                  <div className="w-6 h-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6B3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
                
                {/* Arrow for mobile (vertical) */}
                <div className="flex md:hidden justify-center w-full absolute -bottom-6">
                  <div className="w-6 h-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B6B3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="m5 12 7 7 7-7"></path>
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6 text-[#8B6B3D] font-medium">
        Simple. Fast. Reliable.
      </div>
    </div>

        {/* FAQ Section */}
        <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
              Rental FAQs
            </span>
          </h2>
          
          <div className="space-y-4">
            {[
              {
                question: "What is required to rent equipment?",
                answer: "You'll need a valid ID and a credit card for the security deposit. Some technical items may require proof of competency (e.g., climbing certifications)."
              },
              {
                question: "Can I extend my rental period?",
                answer: "Yes, extensions are possible based on availability. Please contact us at least 24 hours before your scheduled return to arrange an extension. Additional rental fees will apply."
              },
              {
                question: "What happens if equipment is damaged?",
                answer: "Normal wear and tear is expected. For significant damage, repair costs will be deducted from your deposit. We offer optional damage waiver coverage for $5/day that limits your liability."
              },
              {
                question: "Do you offer discounts for group rentals?",
                answer: "Yes! We offer 10% discount for groups of 5+ people and 15% for groups of 10+ people. Contact us for custom group packages and pricing."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-1">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Purchase Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#8B6B3D]/10 p-8 rounded-xl">
            <h3 className="text-xl font-bold text-[#8B6B3D] mb-4 font-serif">Ready to Reserve?</h3>
            <p className="text-gray-600 mb-6">
              Have questions about our equipment or need help selecting the right gear? Our specialists are here to help.
            </p>
            <Link 
              to="/contact" 
              className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
            >
              <FaEnvelope className="mr-2" />
              Contact Our Gear Experts
            </Link>
          </div>
          
          <div className="bg-[#8B6B3D] p-8 rounded-xl text-white">
            <h3 className="text-xl font-bold mb-4 font-serif">Need Equipment Fast?</h3>
            <p className="mb-6">
              For last-minute rentals or urgent inquiries, call us directly for immediate assistance.
            </p>
            <a 
              href="tel:+254 708 414 577" 
              className="bg-white text-[#8B6B3D] hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition duration-300 inline-flex items-center"
            >
              <FaPhone className="mr-2" />
              Call Now: +254 708 414 577
            </a>
          </div>
        </div>

        {/* Cart Summary (sticky bottom on mobile) */}
        {cartItems.length > 0 && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</p>
                <p className="text-sm text-gray-600">
                  Total: ${cartItems.reduce((sum, id) => {
                    const item = rentalItems.find(i => i.id === id);
                    return sum + (item?.price || 0);
                  }, 0)}
                </p>
              </div>
              <Link 
                to="/contact" 
                className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-4 rounded-lg transition duration-300 inline-flex items-center text-sm"
              >
                Proceed to Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentRental;