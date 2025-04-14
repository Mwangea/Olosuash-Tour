import { Link } from "react-router-dom";
import { FaEnvelope, FaFirstAid, FaPhone } from "react-icons/fa";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  Award,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Tent,
  Compass,
} from "lucide-react";
import { GiBoots } from "react-icons/gi";
import { motion } from 'framer-motion';

// Training data for visualization
const trainingData = [
  { week: 1, cardio: 3, distance: 12, elevation: 300, packWeight: 0 },
  { week: 2, cardio: 4, distance: 16, elevation: 400, packWeight: 0 },
  { week: 3, cardio: 3, distance: 18, elevation: 500, packWeight: 5 },
  { week: 4, cardio: 4, distance: 20, elevation: 600, packWeight: 5 },
  { week: 5, cardio: 3, distance: 22, elevation: 700, packWeight: 10 },
  { week: 6, cardio: 4, distance: 24, elevation: 800, packWeight: 12 },
  { week: 7, cardio: 4, distance: 26, elevation: 900, packWeight: 12 },
  { week: 8, cardio: 5, distance: 30, elevation: 1000, packWeight: 15 },
];

// Weekly training descriptions
const weeklyDescriptions = {
  "1-2":
    "Building a strong cardio foundation with 3-4 sessions per week. Focus on consistent distance without pack weight to establish endurance baseline.",
  "3-4":
    "Introducing weighted pack hikes starting at 5kg. Begin training on varied terrain and increase elevation gain gradually.",
  "5-6":
    "Progressing to medium pack weights (10-12kg). Incorporating interval training and longer duration hikes to build stamina.",
  "7-8":
    "Peak training with back-to-back days and full pack weight (12-15kg). Simulating actual climb conditions with maximum elevation gain.",
};

// Gear data structure
const gearCategories = [
  {
    id: "clothing",
    name: "Clothing",
    icon: Layers,
    color: "#8B6B3D",
    description: "Layered system (base, insulation, shell)",
    items: [
      { name: "Moisture-wicking base layer (top & bottom)", essential: true },
      { name: "Mid-layer fleece or down jacket", essential: true },
      { name: "Waterproof/windproof shell jacket", essential: true },
      { name: "Waterproof/windproof shell pants", essential: true },
      { name: "Warm hat & sun hat", essential: true },
      { name: "Liner gloves & waterproof outer gloves", essential: true },
      { name: "Warm socks (3+ pairs)", essential: true },
      { name: "Neck gaiter or buff", essential: false },
      { name: "Sunglasses (100% UV protection)", essential: true },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: GiBoots,
    color: "#8B6B3D",
    description: "Waterproof hiking boots + gaiters",
    items: [
      { name: "Waterproof hiking/mountaineering boots", essential: true },
      { name: "Gaiters", essential: true },
      {
        name: "Microspikes or crampons (depending on conditions)",
        essential: true,
      },
      { name: "Camp shoes/sandals", essential: false },
      { name: "Extra insoles", essential: false },
    ],
  },
  {
    id: "shelter",
    name: "Shelter",
    icon: Tent,
    color: "#8B6B3D",
    description: "4-season tent + sleeping bag (-10°C rating)",
    items: [
      { name: "4-season tent with rainfly", essential: true },
      { name: "Sleeping bag rated to -10°C or colder", essential: true },
      { name: "Sleeping pad (high R-value)", essential: true },
      { name: "Tarp or footprint", essential: false },
      { name: "Tent repair kit", essential: true },
    ],
  },
  {
    id: "navigation",
    name: "Navigation",
    icon: Compass,
    color: "#8B6B3D",
    description: "Map, compass, GPS device",
    items: [
      { name: "Topographic map (waterproof)", essential: true },
      { name: "Compass", essential: true },
      { name: "GPS device with extra batteries", essential: true },
      { name: "Altimeter", essential: false },
      { name: "Route description & waypoints", essential: true },
    ],
  },
  {
    id: "safety",
    name: "Safety",
    icon: FaFirstAid,
    color: "#8B6B3D",
    description: "First aid kit, headlamp, emergency shelter",
    items: [
      { name: "First aid kit", essential: true },
      { name: "Headlamp with extra batteries", essential: true },
      { name: "Emergency shelter (bivy or blanket)", essential: true },
      { name: "Whistle", essential: true },
      { name: "Fire starter", essential: true },
      { name: "Multi-tool or knife", essential: true },
      { name: "Personal locator beacon", essential: false },
      { name: "Two-way radios", essential: false },
    ],
  },
];

// Gear graphic component
function GearSVG() {
  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Background mountain */}
      <path d="M0,350 L150,100 L300,250 L450,50 L600,350 Z" fill="#E9ECEF" />

      {/* Hiking trail */}
      <path
        d="M100,350 C150,300 200,330 250,290 C300,250 350,270 400,240 C450,210 500,230 550,200"
        fill="none"
        stroke="#B08C55"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="10,10"
      />

      {/* Gear items */}
      {/* Backpack */}
      <g transform="translate(200, 150) scale(3)">
        <path
          d="M20 8v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V8c0-1.86 1.28-3.41 3-3.86V2h3v2h4V2h3v2.14c1.72.45 3 2 3 3.86zM6 12v2h10v2h2v-4H6z"
          fill="#8B6B3D"
        />
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="none"
          stroke="#5E4B2B"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      </g>

      {/* Boots */}
      <g transform="translate(100, 280) scale(2.5)">
        <path
          d="M22 9.8V8c0-2-2-4-4-4h-2C14 4 6 5 6 5s-4 .17-4 4v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2.2zM20 12H4v-3c0-2.25 1.75-3 2-3 0 0 8-1 10-1h2c1.1 0 2 .9 2 2v5z"
          fill="#5E4B2B"
        />
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="none"
          stroke="#8B6B3D"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      </g>

      {/* Compass */}
      <g transform="translate(450, 150) scale(2.5)">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
          fill="#8B6B3D"
        />
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="none"
          stroke="#5E4B2B"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      </g>

      {/* Tent */}
      <g transform="translate(320, 220) scale(3)">
        <path
          d="M12,3L2,12h3v8h14v-8h3L12,3z M12,18h-4v-4h4V18z"
          fill="#5E4B2B"
        />
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="none"
          stroke="#8B6B3D"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      </g>

      {/* First aid */}
      <g transform="translate(450, 280) scale(2)">
        <path
          d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0-2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zm0 10h-2v2h-2v-2H6v-2h2v-2h2v2h2v2z"
          fill="#8B6B3D"
        />
        <circle
          cx="12"
          cy="12"
          r="15"
          fill="none"
          stroke="#5E4B2B"
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />
      </g>

      {/* Connection lines */}
      <path
        d="M200,150 L320,220"
        stroke="#5E4B2B"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d="M200,150 L100,280"
        stroke="#5E4B2B"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d="M320,220 L450,280"
        stroke="#5E4B2B"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d="M320,220 L450,150"
        stroke="#5E4B2B"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d="M200,150 L450,150"
        stroke="#5E4B2B"
        strokeWidth="2"
        strokeDasharray="5,5"
      />

      {/* Labels */}
      <text x="200" y="120" fontSize="16" fill="#5E4B2B" fontWeight="bold">
        Clothing
      </text>
      <text x="100" y="250" fontSize="16" fill="#5E4B2B" fontWeight="bold">
        Footwear
      </text>
      <text x="320" y="190" fontSize="16" fill="#5E4B2B" fontWeight="bold">
        Shelter
      </text>
      <text x="450" y="120" fontSize="16" fill="#5E4B2B" fontWeight="bold">
        Navigation
      </text>
      <text x="450" y="250" fontSize="16" fill="#5E4B2B" fontWeight="bold">
        Safety
      </text>

      {/* Title */}
      <text
        x="300"
        y="40"
        fontSize="24"
        fill="#8B6B3D"
        fontWeight="bold"
        textAnchor="middle"
      >
        Essential Mountain Climbing Gear
      </text>
    </svg>
  );
}

const metrics = [
  { id: "distance", name: "Weekly Distance (km)", color: "#2563eb" },
  { id: "elevation", name: "Elevation Gain (m)", color: "#16a34a" },
  { id: "packWeight", name: "Pack Weight (kg)", color: "#9f1239" },
  { id: "cardio", name: "Cardio Sessions", color: "#7c3aed" },
];

const MountainClimbingGuide = () => {
  const [activeMetric, setActiveMetric] = useState("distance");
  const [selectedPhase, setSelectedPhase] = useState("1-2");

  const [showEssentialOnly, setShowEssentialOnly] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<
    string | number | null
  >(null);

  const toggleCategory = (categoryId: string | number) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      <div className="container mx-auto px-4">
        {/* Hero Section with Image */}
        <div className="relative h-[50vh] mb-5 overflow-hidden rounded-xl">
        <motion.div 
          className="absolute inset-0 bg-[url('/mt-climax.jpg')] bg-cover bg-center"
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

        {/* Training Visualization */}
        <div className="bg-white p-8 mb-12 rounded-xl shadow-md border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-yellow-900">
                8-Week Training Progress Visualization
              </span>
            </h2>
            <p className="text-gray-600">
              Interactive chart showing progression of key training metrics
            </p>
          </div>

          {/* Chart area */}
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trainingData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="week"
                  label={{
                    value: "Week",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {metrics.map((metric) => (
                  <Line
                    key={metric.id}
                    type="monotone"
                    dataKey={metric.id}
                    stroke={metric.color}
                    strokeWidth={activeMetric === metric.id ? 3 : 1.5}
                    dot={{ r: activeMetric === metric.id ? 5 : 3 }}
                    activeDot={{ r: 8 }}
                    opacity={activeMetric === metric.id ? 1 : 0.6}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metric selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Focus Metric:
            </h3>
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setActiveMetric(metric.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeMetric === metric.id
                      ? "bg-amber-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {metric.name}
                </button>
              ))}
            </div>
          </div>

          {/* Training phases */}
          <div className="mb-6">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <Award className="text-amber-700 mr-2" size={20} />
              Weekly Training Targets
            </h3>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {["1-2", "3-4", "5-6", "7-8"].map((phase) => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`px-3 py-2 rounded-lg text-center text-sm font-medium transition-all ${
                    selectedPhase === phase
                      ? "bg-amber-700 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Weeks {phase}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">
                Weeks {selectedPhase}
              </h4>
              <p className="text-gray-600">
                {
                  weeklyDescriptions[
                    selectedPhase as keyof typeof weeklyDescriptions
                  ]
                }
              </p>
            </div>
          </div>

          {/* Key milestones */}
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <ArrowUpRight className="text-amber-700 mr-2" size={20} />
              Progress Milestones
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 font-bold">•</span>
                <span>
                  <strong>Week 2:</strong> Complete a 16km hike without fatigue
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 font-bold">•</span>
                <span>
                  <strong>Week 4:</strong> Comfortable with 5kg pack for 20km
                  distance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 font-bold">•</span>
                <span>
                  <strong>Week 6:</strong> Successfully navigate 800m elevation
                  gain with 12kg pack
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-700 mr-2 font-bold">•</span>
                <span>
                  <strong>Week 8:</strong> Complete two consecutive 15km+ hikes
                  with full pack
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gear Checklist with Infographic */}
        <div className="bg-white p-6 mb-12 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 font-serif">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-yellow-900">
                  Essential Gear Checklist
                </span>
              </h2>

              <div className="mb-4 flex items-center">
                <label className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEssentialOnly}
                    onChange={() => setShowEssentialOnly(!showEssentialOnly)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-amber-700 focus:ring-amber-700"
                  />
                  Show essential items only
                </label>
              </div>

              <div className="space-y-3">
                {gearCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center">
                        <category.icon
                          size={20}
                          className="text-amber-700 mr-3"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </div>

                    {expandedCategory === category.id && (
                      <div className="p-3 bg-white">
                        <ul className="space-y-2">
                          {category.items
                            .filter(
                              (item) => !showEssentialOnly || item.essential
                            )
                            .map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <div
                                  className={`flex-shrink-0 w-5 h-5 rounded-full ${
                                    item.essential
                                      ? "bg-amber-700"
                                      : "bg-gray-300"
                                  } flex items-center justify-center mt-0.5`}
                                >
                                  {item.essential && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                                <span className="ml-2 text-gray-700">
                                  {item.name}
                                </span>
                                {item.essential && (
                                  <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                                    Essential
                                  </span>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg h-full flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Gear Infographic
              </h3>
              <div className="flex-grow">
                <GearSVG />
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  Properly packing your gear is as important as having the right
                  equipment. Keep heavy items centered and close to your back.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA Section */}
        <div className="bg-[#8B6B3D] p-8 rounded-xl text-center text-white">
          <h3 className="text-2xl font-bold font-serif mb-4">
            Need Personalized Advice?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Our mountain experts can help you prepare for your specific climb.
            Contact us for customized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-[#8B6B3D] hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
            >
              <FaEnvelope className="mr-2" />
              Contact Our Team
            </Link>
            <a
              href="tel:+254 708 414 577"
              className="bg-[#6B4F2D] hover:bg-[#5E4B2B] font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
            >
              <FaPhone className="mr-2" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MountainClimbingGuide;
