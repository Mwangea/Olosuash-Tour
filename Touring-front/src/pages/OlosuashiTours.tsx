import { useState } from 'react';
import { 
  FaUsers,
  FaGlobeAfrica,
  FaAward,
  FaHandsHelping,
  FaChevronDown
} from 'react-icons/fa';
import { Link } from "react-router-dom";

const AboutPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('mission');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const teamMembers = [
    {
      name: "Felix kiu",
      role: "Founder & CEO",
      bio: "Tourism expert with 15+ years experience in creating unforgettable travel experiences across Africa.",
      image: "/ceo.png"
    },
    {
      name: "Sarah Kyach",
      role: "Operations Manager and Business consultant ",
      bio: "Ensures all our tours run smoothly with her exceptional organizational skills and attention to detail.",
      image: "/sarah.jpg"
    },
    {
      name: "victor solitei",
      role: "Communication director",
      bio: "Certified safari guide with extensive knowledge of Kenya's wildlife and ecosystems.",
      image: "/comm.jpg"
    },
    {
      name: "Matteo",
      role: "Mawimbi Manager",
      bio: "Committed to leading the Mawimbi team with excellence, ensuring seamless operations and delivering outstanding service to every client.",
      image: "/matteo.jpg"
    }
  ];

  const milestones = [
    { year: "2010", title: "Founded", description: "Olosuashi started as a small tour operator in Nairobi" },
    { year: "2013", title: "First Safari", description: "Launched our signature Maasai Mara safari experience" },
    { year: "2016", title: "Expansion", description: "Extended operations to Tanzania and Uganda" },
    { year: "2019", title: "Award", description: "Won Kenya Tourism Board's 'Best Tour Operator' award" },
    { year: "2022", title: "Rebrand", description: "Launched new website and expanded digital services" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax Effect */}
      <div 
        className="bg-[#8B6B3D] py-32 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url("/mawimbi.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          
        }}
      >
        <div className="absolute inset-0 bg-[#8B6B3D] opacity-80"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Olosuashi</h1>
          <p className="text-xl max-w-2xl mx-auto">Discover our story, values, and the team behind your unforgettable African adventures</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Our Story Section */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaGlobeAfrica className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Our Story</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Founded in 2010, Olosuashi began as a passion project by our CEO  Felix kiu, who wanted to share the beauty of Kenya with the world. 
                What started as a small operation with just one Land Cruiser has grown into one of East Africa's most respected tour operators.
              </p>
              <p className="text-gray-600 mb-4">
                The name "Olosuashi" comes from the Maasai word meaning "the beautiful one," reflecting our commitment to showcasing Africa's 
                breathtaking landscapes, rich cultures, and magnificent wildlife.
              </p>
              <p className="text-gray-600">
                Today, we operate across Kenya, Tanzania, and Uganda, offering carefully curated experiences that combine adventure, comfort, 
                and authentic cultural immersion.
              </p>
            </div>
            <div className="rounded overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Our team on safari" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission & Values Tabs */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaHandsHelping className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Our Mission & Values</h2>
          </div>
          
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'mission' ? 'text-[#8B6B3D] border-b-2 border-[#8B6B3D]' : 'text-gray-600'}`}
                onClick={() => setActiveTab('mission')}
              >
                Our Mission
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'values' ? 'text-[#8B6B3D] border-b-2 border-[#8B6B3D]' : 'text-gray-600'}`}
                onClick={() => setActiveTab('values')}
              >
                Core Values
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm ${activeTab === 'impact' ? 'text-[#8B6B3D] border-b-2 border-[#8B6B3D]' : 'text-gray-600'}`}
                onClick={() => setActiveTab('impact')}
              >
                Community Impact
              </button>
            </div>
          </div>
          
          <div className="min-h-[200px]">
            {activeTab === 'mission' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F5F0E6] p-4 rounded">
                  <h3 className="font-bold text-[#8B6B3D] mb-2">Our Mission</h3>
                  <p className="text-gray-600 text-sm">
                    To create transformative travel experiences that connect people with Africa's natural wonders while supporting conservation 
                    and local communities.
                  </p>
                </div>
                <div className="bg-[#F5F0E6] p-4 rounded">
                  <h3 className="font-bold text-[#8B6B3D] mb-2">Our Vision</h3>
                  <p className="text-gray-600 text-sm">
                    To be East Africa's most sustainable and innovative tour operator, setting the standard for responsible tourism.
                  </p>
                </div>
                <div className="bg-[#F5F0E6] p-4 rounded">
                  <h3 className="font-bold text-[#8B6B3D] mb-2">Our Approach</h3>
                  <p className="text-gray-600 text-sm">
                    We combine expert local knowledge with personalized service to craft journeys that exceed expectations.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'values' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border border-gray-200 p-4 rounded">
                  <div className="text-[#8B6B3D] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Authenticity</h3>
                  <p className="text-gray-600 text-sm">
                    We deliver genuine African experiences that respect local cultures and traditions.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded">
                  <div className="text-[#8B6B3D] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Excellence</h3>
                  <p className="text-gray-600 text-sm">
                    We maintain the highest standards in all aspects of our operations and services.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded">
                  <div className="text-[#8B6B3D] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Sustainability</h3>
                  <p className="text-gray-600 text-sm">
                    We prioritize eco-friendly practices and support conservation efforts.
                  </p>
                </div>
                <div className="border border-gray-200 p-4 rounded">
                  <div className="text-[#8B6B3D] mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Community</h3>
                  <p className="text-gray-600 text-sm">
                    We invest in local communities and create meaningful partnerships.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'impact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Conservation Efforts</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    We partner with wildlife conservation organizations and contribute 5% of our profits to anti-poaching initiatives 
                    and habitat preservation projects across East Africa.
                  </p>
                  <div className="bg-[#F5F0E6] p-3 rounded text-center">
                    <p className="text-sm text-[#8B6B3D] font-medium">
                      <span className="font-bold">2,500+ acres</span> of wildlife habitat protected through our partnerships
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Community Development</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Our tours directly benefit local communities through employment, cultural exchange programs, and infrastructure 
                    projects. We prioritize working with locally-owned suppliers and accommodations.
                  </p>
                  <div className="bg-[#F5F0E6] p-3 rounded text-center">
                    <p className="text-sm text-[#8B6B3D] font-medium">
                      <span className="font-bold">85%</span> of our staff are hired from local communities near our tour destinations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Our Team Section */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaUsers className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Meet Our Team</h2>
          </div>
          
          <p className="text-gray-600 mb-6 max-w-3xl">
            Our team combines deep local expertise with a passion for creating exceptional travel experiences. Each member brings unique 
            skills and perspectives to ensure every detail of your journey is perfect.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="border border-gray-200 rounded overflow-hidden hover:shadow-lg transition">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{member.name}</h3>
                  <p className="text-[#8B6B3D] text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Achievements */}
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <FaAward className="text-white text-lg" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Our Journey</h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 h-full w-0.5 bg-[#8B6B3D] top-0 md:left-1/2 md:-ml-0.5"></div>
            
            {/* Timeline items */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative pl-10 md:pl-0 md:flex md:odd:flex-row-reverse">
                  {/* Year bubble */}
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-[#8B6B3D] flex items-center justify-center text-white font-bold text-sm -ml-4 md:left-1/2 md:-ml-4">
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className={`md:w-5/12 md:px-4 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-1">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-[#8B6B3D] p-2 rounded mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">More About Us</h2>
          </div>
          
          <div className="space-y-3">
            <div className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleSection('safety')}
                className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none"
              >
                <h3 className="font-medium text-gray-800">What safety measures do you have in place?</h3>
                <FaChevronDown 
                  className={`text-[#8B6B3D] transition-transform duration-200 ${expandedSection === 'safety' ? 'transform rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`px-2 pb-4 text-gray-600 text-sm ${expandedSection === 'safety' ? 'block' : 'hidden'}`}
              >
                <p className="mb-2">Your safety is our top priority. All our vehicles are regularly serviced and equipped with first aid kits. Our guides are trained in wilderness first aid and emergency procedures.</p>
                <p>We monitor travel advisories and adjust itineraries as needed to ensure safe experiences.</p>
              </div>
            </div>
            
            <div className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleSection('sustainability')}
                className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none"
              >
                <h3 className="font-medium text-gray-800">How do you practice sustainable tourism?</h3>
                <FaChevronDown 
                  className={`text-[#8B6B3D] transition-transform duration-200 ${expandedSection === 'sustainability' ? 'transform rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`px-2 pb-4 text-gray-600 text-sm ${expandedSection === 'sustainability' ? 'block' : 'hidden'}`}
              >
                <p className="mb-2">We implement several sustainability practices:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Carbon offset programs for all our tours</li>
                  <li>Partnership with eco-friendly lodges and camps</li>
                  <li>Strict waste management policies on all tours</li>
                  <li>Support for community-owned conservancies</li>
                  <li>Education programs for travelers on responsible tourism</li>
                </ul>
              </div>
            </div>
            
            <div className="border-b border-gray-200 last:border-0">
              <button
                onClick={() => toggleSection('difference')}
                className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none"
              >
                <h3 className="font-medium text-gray-800">What makes Olosuashi different from other tour operators?</h3>
                <FaChevronDown 
                  className={`text-[#8B6B3D] transition-transform duration-200 ${expandedSection === 'difference' ? 'transform rotate-180' : ''}`}
                />
              </button>
              <div 
                className={`px-2 pb-4 text-gray-600 text-sm ${expandedSection === 'difference' ? 'block' : 'hidden'}`}
              >
                <p className="mb-2">Three key things set us apart:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">Local Expertise:</span> Our team is born and raised in East Africa with deep connections to the communities we visit.
                  </li>
                  <li>
                    <span className="font-semibold">Personalized Service:</span> We customize every itinerary to match your interests and travel style.
                  </li>
                  <li>
                    <span className="font-semibold">Ethical Commitment:</span> We're transparent about how our operations benefit local people and environments.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#8B6B3D] p-6 rounded text-white">
            <h3 className="text-xl font-bold mb-3">Ready for Your Adventure?</h3>
            <p className="mb-4">Explore our carefully crafted tour packages and start planning your unforgettable journey.</p>
            <Link
              to="/tours"
              className="inline-block bg-white hover:bg-gray-100 text-[#8B6B3D] font-medium py-2 px-4 rounded transition"
            >
              View Our Tours
            </Link>
          </div>
          <div className="bg-gray-800 p-6 rounded text-white">
            <h3 className="text-xl font-bold mb-3">Have More Questions?</h3>
            <p className="mb-4">Our team is happy to help with any inquiries about our services or destinations.</p>
            <Link
              to="/contact"
              className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-4 rounded transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;