import {  FaHeart, FaMapMarkedAlt, FaSafari, FaUsers, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import {  MdNature } from 'react-icons/md';


const CustomSafaris = () => {
  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      {/* Hero Section - Clean, minimal */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/savannah-sunset.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="px-8 sm:px-16 lg:px-24 max-w-3xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-center font-bold text-white mb-6 font-serif tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
                Customized Safaris
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-10 font-light">
              Experience unparalleled, tailor-made safaris in Kenya and Tanzania designed around your preferences.
            </p>
            <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded transition duration-300 shadow-lg">
              Design Your Safari
            </button>
          </div>
        </div>
      </div>

      {/* Introduction - More substantial content */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#5E4B2B] font-serif">
                The Art of Custom Safari Design
              </h2>
              <div className="text-lg space-y-6">
                <p>
                  At Olosuashi Tours, we understand that a truly memorable safari transcends the ordinary tourist experience. Our custom safari designs begin with your vision and are shaped by our deep local expertise and decades of experience across East Africa's most breathtaking landscapes.
                </p>
                <p>
                  Whether you're drawn to the thundering herds of the Great Migration, seeking intimate encounters with the Big Five, or hoping to immerse yourself in authentic cultural experiences, we craft each itinerary from scratch to align perfectly with your aspirations, pace, and interests.
                </p>
                <p>
                  Our approach combines meticulous attention to detail with a genuine passion for conservation and sustainable tourism. We believe luxury isn't just about thread counts and champagne sundowners though we excel at those too it's about creating profound connections with Africa's wild places and people.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/guide-with-guests.jpg" 
                alt="Professional safari guide with guests observing wildlife" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Services - Minimal design */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-[#F8F4EA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-[#5E4B2B] font-serif">
            Distinguished Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <div className="flex items-start mb-6">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <FaSafari size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Private Safari Vehicles</h3>
                  <p className="text-gray-700">
                    Exclusively reserved 4x4 Land Cruisers with experienced guides, offering unparalleled flexibility to explore at your own pace. Each vehicle features charging points, refrigeration for beverages, and panoramic roof hatches optimized for wildlife viewing and photography.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Expert Local Guides</h3>
                  <p className="text-gray-700">
                    Our guides are not merely drivers but regional specialists with deep knowledge of wildlife behavior, local ecosystems, and conservation efforts. Many hold advanced certifications in ornithology, animal tracking, and regional natural history, ensuring insightful interpretation of your safari experiences.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <IoCalendarOutline size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Bespoke Itinerary Design</h3>
                  <p className="text-gray-700">
                    We craft each safari from the ground up, considering seasonal wildlife movements, your specific interests, and preferred accommodation styles. Our itineraries balance iconic destinations with lesser known gems, creating a journey that feels both comprehensive and exclusive.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-start mb-6">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <MdNature size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Curated Accommodations</h3>
                  <p className="text-gray-700">
                    From intimate tented camps that evoke the golden age of safari to sophisticated eco-lodges with modern amenities, we select each property based on location, service quality, and alignment with your preferences. Our longstanding relationships with premier accommodations ensure preferential treatment and special considerations for our clients.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <FaMapMarkedAlt size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Seamless Logistics</h3>
                  <p className="text-gray-700">
                    We handle all transportation arrangements, including optional charter flights between destinations to maximize your time in the wilderness. Our operations team monitors your journey in real-time, ready to make adjustments should wildlife movements or weather conditions change, ensuring you're always in the right place at the right time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="text-[#8B6B3D] mr-4 mt-1">
                  <FaHeart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Personalized Experiences</h3>
                  <p className="text-gray-700">
                    Beyond traditional game drives, we incorporate experiences tailored to your interests whether that's specialized photography instruction, walking safaris with renowned trackers, meaningful cultural exchanges, or exclusive conservation activities normally inaccessible to visitors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safari Experiences - More substantial content */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-8 text-[#5E4B2B] font-serif">
                Signature Safari Experiences
              </h2>
              <div className="text-lg space-y-6">
                <p>
                  Our most discerning clients often request experiences that transcend the conventional safari. We specialize in creating moments of extraordinary connection with East Africa's landscapes, wildlife, and cultures:
                </p>
                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="text-xl font-bold mb-2">The Great Migration Up Close</h3>
                    <p className="text-gray-700">
                      Witness the drama of the wildebeest migration through strategic timing and exclusive camp locations. Our migration safaris include private viewings of river crossings from carefully selected vantage points away from crowds, and specialized photographic hides for unprecedented proximity to the action.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Conservation Immersion</h3>
                    <p className="text-gray-700">
                      Engage directly with pioneering conservation projects through our exclusive partnerships. Participate in rhino tracking with anti-poaching units, assist researchers with wildlife monitoring, or contribute to community conservation initiatives that demonstrate the vital link between wildlife preservation and local prosperity.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cultural Depth</h3>
                    <p className="text-gray-700">
                      Move beyond superficial cultural tourism with genuine immersion experiences. Share meals with Maasai elders, learn traditional skills from community experts, or participate in authentic ceremonies rarely accessible to outsiders—all facilitated through our respectful, long-term community relationships.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Exclusive Wilderness Access</h3>
                    <p className="text-gray-700">
                      Explore private conservancies and exclusive concessions that offer exceptional wildlife densities without the constraints of national park regulations. These arrangements allow for night drives, off-road tracking, and walking safaris in areas where such activities are otherwise prohibited.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="/mara-sunset.jpg" 
                    alt="Sunset over Maasai Mara with acacia trees" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src="/wildebeest-crossing.jpg" 
                      alt="Dramatic wildebeest river crossing" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src="/family-campfire.jpg" 
                      alt="Evening campfire experience" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Process - Streamlined */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-[#F8F4EA]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-[#5E4B2B] font-serif">
            The Safari Planning Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-10 rounded shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-[#8B6B3D] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  1
                </div>
                <h3 className="text-xl font-bold">Initial Consultation</h3>
              </div>
              <p className="text-gray-700">
                We begin with an in-depth conversation about your travel preferences, wildlife interests, accommodation style, and budget considerations. This comprehensive assessment allows us to understand the essence of your ideal African experience.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-[#8B6B3D] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  2
                </div>
                <h3 className="text-xl font-bold">Proposal Development</h3>
              </div>
              <p className="text-gray-700">
                Our safari designers craft a detailed itinerary proposal including carefully selected properties, strategic routing to maximize wildlife viewing, and special experiences aligned with your interests. Each recommendation is accompanied by our rationale for inclusion.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded shadow-md">
              <div className="flex items-center mb-6">
                <div className="bg-[#8B6B3D] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl mr-4">
                  3
                </div>
                <h3 className="text-xl font-bold">Refinement & Confirmation</h3>
              </div>
              <p className="text-gray-700">
                We collaborate to refine the itinerary until it perfectly matches your vision. Once finalized, we secure all accommodations, activities, and logistics with meticulous attention to detail, providing you with comprehensive pre-departure information.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded shadow-md">
            <h3 className="text-xl font-bold mb-6 text-[#5E4B2B]">Your Safari Journey</h3>
            <p className="text-lg mb-6">
              Throughout your safari, our team provides discreet support, from VIP airport assistance upon arrival to daily communication with your guides and camps. We monitor wildlife movements and make real-time adjustments when advantageous. Your safari experience is continuously refined during your journey to maximize wildlife encounters and personal enjoyment.
            </p>
            <p className="text-lg">
              After your return, we welcome detailed feedback that helps us continuously improve our service and contribute to our understanding of changing conditions in the destinations we serve.
            </p>
          </div>
        </div>
      </section>
      
      {/* Client Testimonials - Minimal design */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-16 text-[#5E4B2B] font-serif">
            Client Testimonials
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <blockquote className="text-lg italic mb-6">
                "Olosuashi Tours orchestrated a safari experience that exceeded our expectations in every way. Their attention to detail from selecting guides who aligned with our interests to choreographing our itinerary around wildlife movements created a journey that felt both seamless and remarkably spontaneous. What distinguishes them is their ability to anticipate needs we hadn't even articulated."
              </blockquote>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#F8F4EA] p-1">
                  <div className="w-full h-full rounded-full bg-[#8B6B3D] text-white flex items-center justify-center text-xl font-bold">
                    L
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-bold">Dr. Lena & James Hawthorne</p>
                  <p className="text-gray-600">Massachusetts, USA</p>
                </div>
              </div>
            </div>
            
            <div>
              <blockquote className="text-lg italic mb-6">
                "After multiple safaris across Africa, our experience with Olosuashi Tours has set a new standard. Their regional expertise revealed aspects of Kenya and Tanzania we would never have discovered otherwise. Even more impressive was their ability to pivot when unexpected opportunities arose extending our time with a remarkable cheetah family by rearranging logistics without disruption."
              </blockquote>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-[#F8F4EA] p-1">
                  <div className="w-full h-full rounded-full bg-[#8B6B3D] text-white flex items-center justify-center text-xl font-bold">
                    A
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-bold">Amara & Malik Al-Farsi</p>
                  <p className="text-gray-600">Dubai, UAE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Commitment - Additional content */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-[#F8F4EA]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#5E4B2B] font-serif">
                Our Conservation Commitment
              </h2>
              <div className="text-lg space-y-6">
                <p>
                  At Olosuashi Tours, we believe that exceptional safari experiences and meaningful conservation impact are inseparable. Our business model incorporates tangible conservation contributions through several key initiatives:
                </p>
                <div className="space-y-6 mt-8">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Direct Habitat Protection</h3>
                    <p className="text-gray-700">
                      Five percent of our profits fund the acquisition and protection of critical wildlife corridors between established conservation areas. These corridors maintain ecosystem connectivity and enable seasonal migrations essential for species survival.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Community Conservation Partnerships</h3>
                    <p className="text-gray-700">
                      We prioritize partnerships with conservancies that demonstrate equitable benefit-sharing with local communities. This approach ensures that those living alongside wildlife have meaningful economic incentives for conservation rather than land conversion.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-2">Carbon-Conscious Operations</h3>
                    <p className="text-gray-700">
                      Beyond standard carbon offsetting, we implement a comprehensive emissions reduction strategy throughout our operations and work exclusively with partners committed to reducing their environmental footprint through renewable energy adoption and waste elimination.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/conservation-project.jpg" 
                alt="Conservation project with local community members" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Minimalist */}
      <section className="py-20 px-8 sm:px-16 lg:px-24 bg-[#8B6B3D] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-serif">
              Begin Your Safari Journey
            </h2>
            <p className="text-xl">
              We invite you to take the first step toward your personalized East African safari experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="bg-white/10 p-8 rounded">
                <FaPhone size={24} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Call</h3>
                <a href="tel:+254708414577" className="hover:underline">+254708414577</a>
              </div>
            </div>
            
            <div>
              <div className="bg-white/10 p-8 rounded">
                <FaEnvelope size={24} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Email</h3>
                <a href="mailto:info@olosuashi.com" className="hover:underline">info@olosuashi.com</a>
              </div>
            </div>
            
            <div>
              <div className="bg-white/10 p-8 rounded">
                <FaWhatsapp size={24} className="mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
                <a href="https://wa.me/254708414577" className="hover:underline">Start a Conversation</a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <button className="bg-white hover:bg-gray-100 text-[#8B6B3D] font-medium py-3 px-10 rounded transition duration-300">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomSafaris;