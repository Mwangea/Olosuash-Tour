import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaQuoteLeft, 
  FaGlobeAfrica, 
  FaCertificate, 
  FaChevronDown,
  FaUserCheck
} from 'react-icons/fa';

const SafariGuides = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const guides = [
    {
      id: 1,
      name: "Cephas Sadala",
      photo: "/clephas.jpg",
      dob: "1968",
      experience: "15 years",
      certification: "KPSGA Gold Level",
      languages: ["Swahili", "English"],
      specialties: ["Big Five tracking", "Bird watching", "Photography guidance"],
      region: ["Masai Mara", "Amboseli", "Tsavo"],
      rating: 5,
      reviews: 127
    },
    {
      id: 2,
      name: "Elvis lerionka",
      photo: "/elivis.jpg",
      dob: "1982",
      experience: "15 years",
      certification: "KPSGA Silver Level",
      languages: ["Swahili", "English", "Italian"],
      specialties: ["Cultural tours", "Night game drives", "Conservation education"],
      region: ["Samburu", "Laikipia", "Northern Kenya"],
      rating: 4.9,
      reviews: 89
    }
  ];

  const faqs = [
    {
      question: "How experienced are your safari guides?",
      answer: "Our professional guides have 15+ years of safari experience each. They have deep knowledge of wildlife behavior, tracking skills, and a passion for sharing Kenya's wonders."
    },
    {
      question: "What qualifications do your safari guides have?",
      answer: "Both guides are certified by the Kenya Professional Safari Guides Association (KPSGA) at Gold and Silver levels. They undergo regular training in first aid, wildlife behavior, and customer service."
    },
    {
      question: "What languages can your safari guides speak?",
      answer: "Both guides speak fluent English and Swahili. Abdul also speaks Italian. They can accommodate most international guests with ease."
    },
    {
      question: "Can a safari guide help with photos?",
      answer: "Absolutely! Cephas specializes in photography guidance and can position the vehicle for optimal lighting and angles. Both guides understand wildlife photography needs."
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "Cephas was phenomenal! His ability to spot wildlife was uncanny, and his knowledge of animal behavior made every sighting educational. He anticipated our needs before we even asked.",
      author: "Sarah Johnson",
      location: "USA",
      date: "July 2023",
      rating: 5,
      photo: "/sara-johnson.png",
      guide: "Cephas Sadala"
    },
    {
      id: 2,
      quote: "Elvis lerionka's knowledge of Samburu culture transformed our safari. He arranged special encounters with local communities and his night drive expertise revealed nocturnal wonders we'd never have seen otherwise.",
      author: "Robert Müller",
      location: "Germany",
      date: "August 2023",
      rating: 5,
      photo: "/images/testimonials/robert-muller.jpg",
      guide: "Elvis lerionka"
    }
  ];

  const filteredGuides = activeTab === 'all' 
    ? guides 
    : guides.filter(guide => 
        guide.region.some(region => region.toLowerCase().includes(activeTab.toLowerCase())) ||
        guide.specialties.some(spec => spec.toLowerCase().includes(activeTab.toLowerCase()))
      );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="bg-[#8B6B3D] py-32 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url("/safari-vans.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-[#8B6B3D] opacity-80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Safari Guides</h1>
          <p className="text-xl max-w-2xl mx-auto">Meet the experts who will make your African adventure unforgettable</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction Section */}
        <div className="bg-white border border-gray-200 p-6 mb-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaGlobeAfrica className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">What Makes a Great Safari? A Great Guide!</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                At Olosuashi, we understand that your guide is the key to an unforgettable safari experience. They're not just drivers – they're your eyes, ears, and protectors in the wilderness.
              </p>
              <p className="text-gray-600">
                Our two lead guides each have 15 years of experience, with deep knowledge of wildlife behavior, tracking skills, and a passion for sharing Kenya's wonders. They'll ensure your safety while creating magical moments you'll treasure forever.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/Safeguard-customer.jpg" 
                alt="Safari guide with guests" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Guide Filter Tabs */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">Filter Guides:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'all' ? 'bg-[#8B6B3D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Guides
            </button>
            <button
              onClick={() => setActiveTab('Masai Mara')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'Masai Mara' ? 'bg-[#8B6B3D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Masai Mara
            </button>
            <button
              onClick={() => setActiveTab('Samburu')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'Samburu' ? 'bg-[#8B6B3D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Samburu
            </button>
            <button
              onClick={() => setActiveTab('Photography')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'Photography' ? 'bg-[#8B6B3D] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Photography
            </button>
          </div>
        </div>

        {/* Guide Profiles Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Our Professional Safari Guides</h2>
            <p className="text-gray-600">{filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'} found</p>
          </div>
          
          {filteredGuides.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No guides match your current filter.</p>
              <button
                onClick={() => setActiveTab('all')}
                className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-4 rounded transition"
              >
                Show All Guides
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-64 overflow-hidden relative bg-gray-200">
  <img 
    src={guide.photo} 
    alt={guide.name} 
    className="absolute inset-0 w-full h-full object-cover object-center" 
    style={{ objectPosition: "center 30%" }} // Adjust vertical alignment
  />
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
    <h3 className="font-bold text-xl text-white">{guide.name}</h3>
    <div className="flex items-center text-white text-sm">
      <FaStar className="text-yellow-400 mr-1" />
      <span>{guide.rating} ({guide.reviews} reviews)</span>
    </div>
  </div>
</div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <FaCertificate className="text-[#8B6B3D] mr-2" />
                          <span>{guide.certification}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaUserCheck className="text-[#8B6B3D] mr-2" />
                          <span>{guide.experience} experience</span>
                        </div>
                      </div>
                      <span className="bg-[#F5F0E6] text-[#8B6B3D] text-xs font-medium px-2 py-1 rounded">
                        {guide.region[0]}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">Languages:</h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.languages.map((lang, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">Specialties:</h4>
                      <div className="flex flex-wrap gap-1">
                        {guide.specialties.map((spec, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* KPSGA Certification Section */}
        <div className="bg-[#F5F0E6] p-6 rounded-lg mb-12 border border-[#E0D6C2]">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaCertificate className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">The KPSGA Difference</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                The <strong>Kenya Professional Safari Guides Association (KPSGA)</strong> sets the gold standard for safari guide training and certification in Kenya. Their rigorous testing ensures only the most knowledgeable and skilled guides achieve certification.
              </p>
              <p className="text-gray-600">
                Both of our lead guides are KPSGA certified at Gold and Silver levels, having demonstrated exceptional knowledge of wildlife behavior, ecology, first aid, and customer service excellence.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
              <img 
                src="/kpsga-transparent-logo.png" 
                alt="KPSGA certified guide" 
                className="w-full h-auto object-cover"
              />
              <div className="bg-white p-4 text-center">
                <p className="text-sm text-gray-600">All Olosuashi guides carry official KPSGA certification cards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Guest Experiences</h2>
            <p className="text-gray-600 mt-2">What our travelers say about our guides</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <FaQuoteLeft className="text-[#8B6B3D] text-2xl mr-3" />
                  <div>
                    <h3 className="font-bold text-gray-800">{testimonial.guide}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.author} 
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}, {testimonial.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm mb-12">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Safari Guide FAQs</h2>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="font-medium text-gray-800">{faq.question}</h3>
                  <FaChevronDown 
                    className={`text-[#8B6B3D] transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#8B6B3D] rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Meet Your Guide?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Our team is standing by to help you plan the perfect safari with one of our expert guides.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-block bg-white hover:bg-gray-100 text-[#8B6B3D] font-medium py-3 px-6 rounded transition"
            >
              Contact Us About Guides
            </Link>
            <Link
              to="/tours"
              className="inline-block bg-gray-800 hover:bg-black text-white font-medium py-3 px-6 rounded transition"
            >
              Explore Our Safaris
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariGuides;