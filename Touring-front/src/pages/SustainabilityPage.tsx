import { useState } from 'react';
import { 
  FaLeaf, 
  FaUsers, 
  FaHandHoldingUsd, 
  FaBookOpen, 
  FaCertificate, 
  FaTree, 
  FaRecycle, 
  FaWater,
  FaSeedling,
  FaGlobeAfrica,
  FaHandsHelping,
  FaBalanceScale,
  FaChartLine,
  FaUniversity,
  FaHandshake,
  FaInfoCircle,
  FaStar,
} from 'react-icons/fa';

const SustainabilityPage = () => {
  const [activeTab, setActiveTab] = useState('environmental');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const ecoRatedLodges = [
    { name: "&BEYOND Bateleur Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Amboseli Serena Lodge", region: "Tsavo/Amboseli", certification: "Gold" },
    { name: "Angama Mara Lodge", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Asilia Ol Pejeta Bush Camp", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Bahari Beach Hotel", region: "Coast", certification: "Gold" },
    { name: "Basecamp Masai Mara", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Cottar's 1920's Camp", region: "North Rift", certification: "Gold" },
    { name: "Elewana Elephant Pepper Camp Masai Mara", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Elewana Elsa's Kopje Meru", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Elewana Lewa Safari Camp", region: "North Rift", certification: "Gold" },
    { name: "Elewana Loisaba Lodo Springs", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Elewana Sand River Masai Mara", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Elewana Tortilis Camp Amboseli", region: "Tsavo/Amboseli", certification: "Gold" },
    { name: "Encounter Mara Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Entumoto Safari Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Governors Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Governors' Il Moran Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Hemingways Watamu", region: "Coast", certification: "Gold" },
    { name: "Karen Blixen Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Kicheche Bush Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Kicheche Laikipia Camp", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Kicheche Mara Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Kicheche Valley Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Kilaguni Serena Safari Lodge", region: "Tsavo/Amboseli", certification: "Gold" },
    { name: "Kilima Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Lake Elmenteita Serena Camp", region: "North Rift", certification: "Gold" },
    { name: "Little Governors Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Loldia House", region: "North Rift", certification: "Gold" },
    { name: "Mara Engai Lodge", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Mara Plains Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Mara Serena Safari Lodge", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Medina Palms", region: "Coast", certification: "Gold" },
    { name: "Naboisho Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Ol Seki Hemingways Mara", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Porini Amboseli Camp", region: "Tsavo/Amboseli", certification: "Gold" },
    { name: "Rekero Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Rhino River Camp", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Sanctuary Olonana", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Saruni Eagle View", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Saruni Leopard Hill", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Saruni Mara Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Saruni Samburu", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Serena Beach Resort and Spa", region: "Coast", certification: "Gold" },
    { name: "Severin Sea Lodge", region: "Coast", certification: "Gold" },
    { name: "Sirikoi Lodge", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Soroi Mara Bush Camp", region: "Masai Mara/South Rift", certification: "Gold" },
    { name: "Sweetwaters Serena Camp", region: "Laikipia/Samburu", certification: "Gold" },
    { name: "Tawi Lodge", region: "Tsavo/Amboseli", certification: "Gold" },
    { name: "The Sands at Nomad Beach Resort", region: "Coast", certification: "Gold" }
  ];

  const parkRules = [
    "Respect the privacy of the wildlife, this is their habitat.",
    "Beware of the animals, they are wild and can be unpredictable.",
    "Don't crowd the animals or make sudden noises or movements.",
    "Don't feed the animals, it upsets their diet and leads to human dependence.",
    "Keep quiet, noise disturbs the wildlife and may antagonize your fellow visitors.",
    "Stay in your vehicle at all times, except at designated picnic or walking areas.",
    "Keep below the maximum speed limit (40 kph/25 mph).",
    "Never drive off-road, this severely damages the habitat.",
    "When viewing wildlife keep to a minimum distance of 20 meters.",
    "Leave no litter and never leave fires unattended.",
    "Respect the cultural heritage of Kenya.",
    "Stay over or leave before dusk (6:00 p.m. – 6:00 a.m.) unless camping overnight."
  ];


  const faqs = [
    {
      question: "What makes Olosuashi safaris sustainable?",
      answer: "Our safaris are designed with minimal environmental impact, support local communities, and promote conservation efforts through partnerships with eco-certified lodges and community projects."
    },
    {
      question: "How do you reduce carbon emissions?",
      answer: "We optimize routes, use fuel-efficient vehicles, invest in carbon offset programs, and encourage low-impact activities during tours."
    },
    {
      question: "Can I participate in conservation activities?",
      answer: "Yes! Many of our tours include optional activities like tree planting, wildlife monitoring, or visits to conservation projects."
    },
    {
      question: "How are local communities involved?",
      answer: "We employ local guides, source from community businesses, and allocate a portion of proceeds to local development projects."
    },
    {
      question: "What should I pack for a sustainable safari?",
      answer: "We recommend reusable water bottles, solar-powered chargers, biodegradable toiletries, and clothing in natural colors that blends with the environment."
    }
  ];

  const testimonials = [
    {
      quote: "The most meaningful vacation we've ever taken. Seeing how tourism can positively impact communities changed our perspective.",
      author: "Sarah & Michael Johnson",
      location: "Toronto, Canada",
      rating: 5
    },
    {
      quote: "Impressed by the conservation efforts at every lodge. We learned so much about sustainable tourism practices.",
      author: "David Chen",
      location: "Singapore",
      rating: 5
    },
    {
      quote: "The local guides were incredibly knowledgeable about both wildlife and sustainability. Truly an eco-conscious safari.",
      author: "Emma Rodriguez",
      location: "Madrid, Spain",
      rating: 5
    }
  ];

  const sustainabilityTips = [
    {
      icon: <FaRecycle className="text-3xl text-[#8B6B3D] mb-4" />,
      title: "Pack Light & Right",
      tips: [
        "Bring reusable water bottles",
        "Use biodegradable toiletries",
        "Pack solar-powered chargers"
      ]
    },
    {
      icon: <FaWater className="text-3xl text-[#8B6B3D] mb-4" />,
      title: "Conserve Resources",
      tips: [
        "Take shorter showers",
        "Reuse towels and linens",
        "Turn off lights and AC when not in room"
      ]
    },
    {
      icon: <FaHandsHelping className="text-3xl text-[#8B6B3D] mb-4" />,
      title: "Support Local",
      tips: [
        "Buy from local artisans",
        "Eat at local restaurants",
        "Tip service staff appropriately"
      ]
    },
    {
      icon: <FaLeaf className="text-3xl text-[#8B6B3D] mb-4" />,
      title: "Respect Nature",
      tips: [
        "Stay on marked trails",
        "Never feed wildlife",
        "Avoid single-use plastics"
      ]
    }
  ];

  const sustainabilityTimeline = [
    {
      year: "2010",
      title: "Company Founded with Green Principles",
      description: "Established with core sustainability values and commitment to eco-tourism",
      icon: <FaSeedling className="text-2xl text-[#8B6B3D]" />
    },
    {
      year: "2013",
      title: "First Gold-Certified Partnership",
      description: "Partnered with our first Eco-rated Gold certified lodge",
      icon: <FaCertificate className="text-2xl text-[#8B6B3D]" />
    },
    {
      year: "2015",
      title: "Carbon Reduction Program Launched",
      description: "Implemented our comprehensive carbon footprint reduction strategy",
      icon: <FaTree className="text-2xl text-[#8B6B3D]" />
    },
    {
      year: "2018",
      title: "Community Development Initiative",
      description: "Established education and healthcare programs in local communities",
      icon: <FaUsers className="text-2xl text-[#8B6B3D]" />
    },
    {
      year: "2021",
      title: "95% Carbon Reduction Pledge",
      description: "Committed to reducing emissions by 95% by 2030",
      icon: <FaGlobeAfrica className="text-2xl text-[#8B6B3D]" />
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Parallax */}
      <div 
        className="relative py-32 text-white overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1468413253725-0d5181091126?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-[#8B6B3D] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Sustainable Travel & Ecotourism</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">Eco-friendly East Africa safaris for a healthier planet</p>
          <button className="bg-white text-[#8B6B3D] hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg">
            Explore Our Safaris
          </button>
        </div>
      </div>

       {/* Intro Section */}
       <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img 
                  src="/sustainability-1.webp" 
                  alt="Sustainable safari" 
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Sustainable Vision</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Olosuashi is dedicated to providing unforgettable travel experiences while prioritizing sustainability. 
                  We believe in responsible tourism that minimizes environmental impact, supports local communities, 
                  and promotes cultural preservation.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Our mission is to create a positive impact on the destinations we operate in, ensuring they remain 
                  vibrant and accessible for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-[#F5F0E6]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Sustainability Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-[#8B6B3D] text-4xl font-bold mb-2">95%</div>
              <p className="text-gray-600">Carbon reduction target by 2030</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-[#8B6B3D] text-4xl font-bold mb-2">42</div>
              <p className="text-gray-600">Gold-certified eco lodges</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-[#8B6B3D] text-4xl font-bold mb-2">15K+</div>
              <p className="text-gray-600">Trees planted annually</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-[#8B6B3D] text-4xl font-bold mb-2">85%</div>
              <p className="text-gray-600">Local staff employment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commitment Tabs */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Sustainability Commitments</h2>
          
          <div className="flex flex-wrap justify-center mb-8 gap-2">
            {[
              { id: 'environmental', label: 'Environmental', icon: <FaLeaf className="mr-2" /> },
              { id: 'social', label: 'Social Responsibility', icon: <FaUsers className="mr-2" /> },
              { id: 'economic', label: 'Economic', icon: <FaHandHoldingUsd className="mr-2" /> },
              { id: 'education', label: 'Education', icon: <FaBookOpen className="mr-2" /> },
              { id: 'partnerships', label: 'Partnerships', icon: <FaHandshake className="mr-2" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center mx-1 mb-2 px-6 py-3 rounded-full font-medium ${activeTab === tab.id ? 'bg-[#8B6B3D] text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-[#F5F0E6] rounded-xl shadow-sm p-8">
            {activeTab === 'environmental' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaLeaf className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Environmental Stewardship</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaTree className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Carbon Footprint Reduction</h4>
                        <p className="text-gray-600">
                          We are committed to reducing our carbon emissions by 95% by 2030. This includes optimizing 
                          transportation routes, using fuel-efficient vehicles, and promoting low-impact travel options.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaRecycle className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Waste Management</h4>
                        <p className="text-gray-600">
                          We implement waste reduction strategies such as minimizing single-use plastics, recycling, 
                          and encouraging travelers to follow Leave No Trace principles.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaWater className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Water Conservation</h4>
                        <p className="text-gray-600">
                          Our partner lodges implement water-saving technologies like low-flow fixtures, greywater 
                          recycling, and rainwater harvesting systems.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaSeedling className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Biodiversity Conservation</h4>
                        <p className="text-gray-600">
                          We partner with local conservation organizations to protect natural habitats and wildlife. 
                          A portion of our profits supports environmental initiatives in the regions we visit.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <img 
                    src="/planting.jpg" 
                    alt="Sustainable lodge" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Social Responsibility</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaHandsHelping className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Community Engagement</h4>
                        <p className="text-gray-600">
                          We collaborate with local communities to ensure tourism benefits are shared equitably. 
                          This includes hiring local guides, sourcing products from local businesses, and supporting 
                          community-led projects.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGlobeAfrica className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Cultural Preservation</h4>
                        <p className="text-gray-600">
                          We respect and celebrate the cultural heritage of our destinations. Our tours are designed 
                          to educate travelers about local traditions while avoiding cultural exploitation.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaBalanceScale className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Fair Labor Practices</h4>
                        <p className="text-gray-600">
                          We ensure fair wages, safe working conditions, and equal opportunities for all employees 
                          and partners across our operations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaUniversity className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Education Initiatives</h4>
                        <p className="text-gray-600">
                          We support local schools through our partnership with Pack for a Purpose, providing 
                          educational materials to schools in Mai Mahiu, Emali, and Voi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <img 
                    src="/maasai-wazungu.webp" 
                    alt="Maasai village" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {activeTab === 'economic' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaHandHoldingUsd className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Economic Sustainability</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaChartLine className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Supporting Local Economies</h4>
                        <p className="text-gray-600">
                          We prioritize partnerships with local suppliers, artisans, and service providers to 
                          stimulate economic growth in the regions we operate. Over 80% of our procurement budget 
                          goes to local businesses.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaBalanceScale className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Transparent Pricing</h4>
                        <p className="text-gray-600">
                          We maintain fair and transparent pricing practices, ensuring that our services provide 
                          value while supporting sustainable tourism. Our pricing structure clearly shows how funds 
                          are allocated to conservation and community projects.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaUniversity className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Skills Development</h4>
                        <p className="text-gray-600">
                          We invest in training programs for local staff, providing hospitality and guiding 
                          certifications that create long-term career opportunities in the tourism sector.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHandshake className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Fair Trade Partnerships</h4>
                        <p className="text-gray-600">
                          We've established fair trade agreements with local cooperatives for handicrafts and 
                          agricultural products sold in our lodges and recommended shops.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <img 
                    src="/basket.jpg" 
                    alt="Local market" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaBookOpen className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Education & Advocacy</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Traveler Awareness</h4>
                        <p className="text-gray-600">
                          We educate our customers on sustainable travel practices through pre-trip materials, 
                          guide training, and on-site information. Our "Leave No Trace" program teaches visitors 
                          how to minimize their environmental impact.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGlobeAfrica className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Conservation Education</h4>
                        <p className="text-gray-600">
                          Our guides provide in-depth information about local ecosystems and conservation challenges. 
                          Many tours include visits to research stations or conservation projects with educational 
                          components.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaUniversity className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">School Programs</h4>
                        <p className="text-gray-600">
                          We support environmental education in local schools through curriculum development, 
                          teacher training, and student field trips to conservation areas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHandshake className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Industry Leadership</h4>
                        <p className="text-gray-600">
                          We actively participate in sustainability initiatives and collaborate with industry 
                          partners to promote responsible tourism globally. Our team regularly presents at 
                          conferences and contributes to sustainable tourism guidelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <img 
                    src="/learning.jpg" 
                    alt="Children learning" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />

                </div>
              </div>
            )}

            {activeTab === 'partnerships' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaHandshake className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Certifications & Partnerships</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCertificate className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Ecotourism Kenya</h4>
                        <p className="text-gray-600">
                          We are proud corporate members of Ecotourism Kenya, an organization that champions for 
                          sustainability in travel through certification, advocacy, and education programs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaSeedling className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Pack for a Purpose</h4>
                        <p className="text-gray-600">
                          Through our partnership with Pack for a Purpose, travelers can make a lasting impact by 
                          bringing supplies for schools and medical clinics in Mai Mahiu, Emali, and Voi.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTree className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Wildlife Conservation</h4>
                        <p className="text-gray-600">
                          We partner with the Kenya Wildlife Service and local conservancies to support anti-poaching 
                          efforts, habitat restoration, and wildlife research projects.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaUsers className="text-[#8B6B3D] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800">Community Development</h4>
                        <p className="text-gray-600">
                          Our partnerships with local NGOs support clean water projects, healthcare initiatives, 
                          and women's empowerment programs in communities near our tour routes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4">
                  <img 
                    src="/ngo.jpg" 
                    alt="Eco certification" 
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Eco-Rated Lodges Section */}
      <div className="py-16 bg-[#F5F0E6]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Eco-Rated Lodges & Camps</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We partner with accommodations that meet the highest standards of sustainability and environmental responsibility.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-[#8B6B3D] p-3 rounded-full mr-4">
                  <FaCertificate className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Gold Certified Properties</h3>
              </div>
              <div className="text-sm text-gray-500">
                Certified by Ecotourism Kenya | {ecoRatedLodges.length} properties
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-[#8B6B3D] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Facility</th>
                    <th className="py-4 px-6 text-left">Region</th>
                    <th className="py-4 px-6 text-left">Certification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ecoRatedLodges.map((lodge, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6">{lodge.name}</td>
                      <td className="py-4 px-6">{lodge.region}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {lodge.certification}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Wildlife Park Rules */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Wildlife Park Rules</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Help us protect East Africa's incredible wildlife by following these important guidelines during your safari.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkRules.map((rule, index) => (
              <div key={index} className="bg-[#F5F0E6] p-6 rounded-lg border border-gray-200 flex">
                <div className="text-[#8B6B3D] text-2xl font-bold mr-4">{index + 1}.</div>
                <p className="text-gray-700">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about sustainable travel with Olosuashi.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 last:border-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-5 px-2 text-left focus:outline-none"
                >
                  <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                  <div className="text-[#8B6B3D]">
                    <svg 
                      className={`w-5 h-5 transition-transform duration-200 ${expandedFaqIndex === index ? 'transform rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div 
                  className={`px-2 pb-5 text-gray-600 ${expandedFaqIndex === index ? 'block' : 'hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a 
              href="/faq" 
              className="inline-flex items-center text-[#8B6B3D] hover:text-[#6B4F2D] font-medium transition"
            >
              View all FAQs
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Sustainability Timeline */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Sustainability Journey</h2>
          
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 h-full w-1 bg-[#8B6B3D] transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {sustainabilityTimeline.map((item, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-center">
                  {index % 2 === 0 ? (
                    <>
                      <div className="hidden md:flex md:w-1/2 justify-end pr-8">
                        <div className="text-right">
                          <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <div className="hidden md:flex justify-center items-center w-16 h-16 rounded-full bg-white border-4 border-[#8B6B3D] z-10">
                        {item.icon}
                      </div>
                      <div className="hidden md:flex md:w-1/2 pl-8">
                        <div className="text-left">
                          <div className="text-2xl font-bold text-[#8B6B3D]">{item.year}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="hidden md:flex md:w-1/2 pr-8">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#8B6B3D]">{item.year}</div>
                        </div>
                      </div>
                      <div className="hidden md:flex justify-center items-center w-16 h-16 rounded-full bg-white border-4 border-[#8B6B3D] z-10">
                        {item.icon}
                      </div>
                      <div className="hidden md:flex md:w-1/2 pl-8">
                        <div className="text-left">
                          <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="md:hidden w-full flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-full bg-white border-4 border-[#8B6B3D] flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[#8B6B3D]">{item.year}</div>
                      <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-[#F5F0E6]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Traveler Experiences</h2>
          
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`w-5 h-5 ${i < testimonials[activeTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <blockquote className="text-gray-600 italic text-lg mb-6">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>
              <div className="text-gray-800 font-medium">{testimonials[activeTestimonial].author}</div>
              <div className="text-sm text-gray-500">{testimonials[activeTestimonial].location}</div>
            </div>
            
            <button 
            title='testimonial'
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-[#8B6B3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
            title='testimonial'
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6 text-[#8B6B3D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sustainability Tips Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Sustainable Travel Tips</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sustainabilityTips.map((tip, index) => (
              <div key={index} className="bg-[#F5F0E6] p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{tip.title}</h3>
                <ul className="text-gray-600 space-y-2 text-left">
                  {tip.tips.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-[#8B6B3D] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Book Your Sustainable Safari?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the magic of Africa while making a positive impact on the environment and local communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-lg">
              Book Your Adventure
            </button>
            <button className="bg-white border-2 border-[#8B6B3D] text-[#8B6B3D] hover:bg-[#F5F0E6] font-bold py-3 px-8 rounded-lg transition duration-300">
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;