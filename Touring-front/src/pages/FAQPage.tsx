import { useState } from 'react';
import { 
  FaChevronDown,
  FaLeaf,
  FaShieldAlt,
  FaStar,
  FaPlane,
  FaCalendarAlt,
  FaCamera
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>('general');
  const [expandedFaqs, setExpandedFaqs] = useState<{[key: string]: boolean}>({});

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqSections = [
    {
      id: 'general',
      title: 'General Information',
      icon: <FaShieldAlt className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'general-1',
          question: "What's your cancellation policy?",
          answer: "We offer free cancellation up to 48 hours before your scheduled tour. After that, a 50% fee applies. For safaris, we require at least 30 days notice for full refunds due to lodge and camp booking commitments."
        },
        {
          id: 'general-2',
          question: "Do you offer group discounts?",
          answer: "Yes! Groups of 6+ receive 10% off, and groups of 12+ receive 15% off. Contact us for larger groups as we can offer even better rates for bigger parties."
        },
        {
          id: 'general-3',
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and M-Pesa. On-site cash payments in USD or KES may be available for certain tours."
        },
        {
          id: 'general-4',
          question: "How soon will I get a response?",
          answer: "We typically respond within 1 business day, often much sooner during working hours (9am-6pm EAT). For urgent inquiries, please call our 24/7 support line at +254 755 854 208."
        },
        {
          id: 'general-5',
          question: "How do I book a safari with Africa Kenya Safaris?",
          answer: "Booking a safari with us is easy! Simply browse our safari packages on our website, fill out the inquiry form, or contact us directly. Our team will respond within 24 hours to help customize your perfect safari experience. Once you're satisfied with the itinerary, we'll secure your booking with a 30% deposit, with the balance due 30 days before your arrival."
        },
        {
          id: 'general-6',
          question: "What types of safaris do you offer in Kenya?",
          answer: (
            <div>
              <p className="mb-2">We offer a variety of safari experiences to suit different preferences:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Classic Wildlife Safaris:</span> Explore renowned national parks and reserves like Masai Mara, Amboseli, and Tsavo.</li>
                <li><span className="font-semibold">Bird Watching Tours:</span> Kenya is home to over 1,100 bird species, making it a paradise for bird enthusiasts.</li>
                <li><span className="font-semibold">Cultural Safaris:</span> Immerse yourself in Kenya's rich cultural heritage with visits to authentic Maasai villages.</li>
                <li><span className="font-semibold">Photography Safaris:</span> Led by professional wildlife photographers for optimal photo opportunities.</li>
                <li><span className="font-semibold">Private vs. Group Safaris:</span> Choose between exclusive private safaris or join small group departures.</li>
                <li><span className="font-semibold">Luxury, Mid-range, or Budget Options:</span> We cater to all budgets without compromising on quality.</li>
              </ul>
            </div>
          )
        },
        {
          id: 'general-7',
          question: "What sets Africa Kenya Safaris apart from other safari companies?",
          answer: (
            <div>
              <p className="mb-2">At Africa Kenya Safaris, we distinguish ourselves through:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">100% Kenyan-Owned and Operated:</span> Authentic local expertise and insights.</li>
                <li><span className="font-semibold">Personalized Service:</span> Tailor-made itineraries to match your specific interests and preferences.</li>
                <li><span className="font-semibold">Experienced Guides:</span> Our guides are certified professionals with deep knowledge of Kenya's wildlife and cultures.</li>
                <li><span className="font-semibold">Quality Vehicles:</span> We use well-maintained 4x4 safari vehicles with pop-up roofs for optimal game viewing.</li>
                <li><span className="font-semibold">Value for Money:</span> Competitive prices without compromising on quality or experiences.</li>
                <li><span className="font-semibold">Ethical Practices:</span> Commitment to sustainable tourism and wildlife conservation.</li>
              </ul>
            </div>
          )
        },
        {
          id: 'general-8',
          question: "Do you offer customized safari itineraries?",
          answer: "Absolutely! While we offer standard itineraries, we specialize in creating custom safari experiences. Our team will work with you to design a tailor-made safari based on your preferences, interests, budget, and time constraints. Whether you're interested in wildlife photography, bird watching, cultural experiences, or combining a safari with beach relaxation, we can create the perfect itinerary for you."
        }
      ]
    },
    {
      id: 'accommodation',
      title: 'Accommodation & Wildlife',
      icon: <FaCamera className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'accommodation-1',
          question: "What accommodations can I expect during my safari?",
          answer: (
            <div>
              <p className="mb-2">We offer a range of accommodation options to suit different preferences and budgets:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Luxury Lodges:</span> High-end properties with excellent amenities, gourmet dining, and exceptional service.</li>
                <li><span className="font-semibold">Tented Camps:</span> Comfortable canvas accommodations that blend with the natural environment, ranging from luxury to mid-range.</li>
                <li><span className="font-semibold">Mobile Camping:</span> For more adventurous travelers, we offer mobile camping safaris with professional staff.</li>
                <li><span className="font-semibold">Boutique Hotels:</span> Smaller, intimate properties with personalized service and unique character.</li>
                <li><span className="font-semibold">Family-Friendly Options:</span> Properties that cater specifically to families with children.</li>
              </ul>
              <p className="mt-2">All accommodations are carefully selected based on location, comfort, service quality, and sustainability practices.</p>
            </div>
          )
        },
        {
          id: 'accommodation-2',
          question: "What wildlife can I see on your safaris?",
          answer: (
            <div>
              <p className="mb-2">Kenya offers incredible wildlife viewing opportunities:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">The Big Five:</span> Lion, elephant, buffalo, leopard, and rhinoceros.</li>
                <li><span className="font-semibold">Great Migration:</span> Witness over 1.5 million wildebeest and zebras crossing the Mara River (July-October).</li>
                <li><span className="font-semibold">Predators:</span> Cheetahs, hyenas, jackals, and wild dogs.</li>
                <li><span className="font-semibold">Diverse Herbivores:</span> Giraffes, zebras, various antelope species, hippos, and more.</li>
                <li><span className="font-semibold">Bird Species:</span> Over 1,100 bird species, including flamingos, eagles, and colorful sunbirds.</li>
                <li><span className="font-semibold">Marine Life:</span> If you extend your trip to the coast, you can see dolphins, sea turtles, and seasonal whale sharks.</li>
              </ul>
              <p className="mt-2">Different parks and reserves offer varied wildlife experiences, which we can discuss when planning your safari.</p>
            </div>
          )
        },
        {
          id: 'accommodation-3',
          question: "What should I pack for a safari in Kenya?",
          answer: (
            <div>
              <p className="mb-2">Essential items for your Kenya safari include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Clothing:</span> Neutral-colored, lightweight clothing (khaki, olive, beige); layers for cool mornings and evenings; long sleeves and pants for sun protection and mosquito prevention.</li>
                <li><span className="font-semibold">Footwear:</span> Comfortable walking shoes or boots, sandals for relaxing at camp.</li>
                <li><span className="font-semibold">Sun Protection:</span> Wide-brimmed hat, sunglasses, high SPF sunscreen.</li>
                <li><span className="font-semibold">Camera Equipment:</span> Camera with zoom lens, extra batteries, memory cards, charging equipment.</li>
                <li><span className="font-semibold">Binoculars:</span> Essential for wildlife viewing.</li>
                <li><span className="font-semibold">Health Items:</span> Personal medications, insect repellent, hand sanitizer, first aid kit.</li>
                <li><span className="font-semibold">Documents:</span> Passport, visa, travel insurance details, vaccination certificates.</li>
              </ul>
              <p className="mt-2">We'll provide a comprehensive packing list after booking your safari.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'planning',
      title: 'Planning & Timing',
      icon: <FaCalendarAlt className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'planning-1',
          question: "When is the best time to go on Kenya safari tours?",
          answer: (
            <div>
              <p className="mb-2">Kenya offers year-round safari opportunities, but certain seasons offer different experiences:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Dry Seasons (Jan-Feb, Jun-Oct):</span> Ideal for general wildlife viewing as animals gather around water sources. The Great Migration occurs in the Masai Mara from July-October.</li>
                <li><span className="font-semibold">Green Seasons (Mar-May, Nov-Dec):</span> Lower visitor numbers, lush landscapes, newborn animals, and excellent bird watching. Short rains in November-December are typically light and rarely disrupt safaris.</li>
                <li><span className="font-semibold">Peak Season (Jul-Sep):</span> Coincides with the Great Migration, offering spectacular wildlife viewing but higher prices and more visitors.</li>
                <li><span className="font-semibold">Off-Peak Season (Apr-May):</span> The long rains offer lush landscapes and fewer tourists, with significant discounts available.</li>
              </ul>
              <p className="mt-2">We can help you choose the best time based on your specific interests and budget considerations.</p>
            </div>
          )
        },
        {
          id: 'planning-2',
          question: "How long should I plan for a Kenya safari?",
          answer: "The ideal safari duration depends on your interests and the regions you wish to visit. We recommend a minimum of 4-5 days for a meaningful safari experience, visiting 2-3 different parks or reserves. For a comprehensive Kenya safari covering diverse ecosystems, 7-10 days is ideal. If you'd like to combine your safari with beach time on the coast, we suggest 10-14 days. We can tailor the length of your safari to suit your available time and preferences."
        },
        {
          id: 'planning-3',
          question: "Are Kenya safaris suitable for families with children?",
          answer: "Absolutely! Kenya is a fantastic family safari destination. We offer family-friendly itineraries and accommodations that cater to children of all ages. Many lodges and camps have special programs for kids, family rooms, and child-friendly activities. We recommend safaris for children aged 6 and above, as they'll be able to appreciate the experience more fully. Our guides are experienced in making safaris engaging and educational for young explorers. We can customize your safari pace and activities to suit your family's needs."
        },
        {
          id: 'planning-4',
          question: "What's the difference between national parks and conservancies?",
          answer: "National parks are government-protected areas with stricter regulations, including set opening hours and limitations on activities like night drives and walking safaris. Conservancies are private or community-owned lands that partner with tourism operators to fund conservation. They offer more exclusive experiences with fewer vehicles, flexible hours, and a wider range of activities like night drives, walking safaris, and authentic cultural interactions. Conservancies also provide direct benefits to local communities through employment and revenue sharing. We often recommend combining both for a comprehensive safari experience."
        }
      ]
    },
    {
      id: 'guides',
      title: 'Safari Guides',
      icon: <FaStar className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'guides-1',
          question: "How experienced are your safari guides?",
          answer: "Our team of 16 professional guides has a combined 200+ years of safari experience. Our most senior guide has 30 years in the field, while our newest team members have at least 5 years of experience before joining Olosuashi."
        },
        {
          id: 'guides-2',
          question: "How much should I tip my safari guide?",
          answer: "While tipping is always at your discretion, we recommend $15-$25 per person per day for your guide. For exceptional service, feel free to tip more. Tips can be given directly to your guide at the end of your safari."
        },
        {
          id: 'guides-3',
          question: "What qualifications do your safari guides have?",
          answer: "All Olosuashi guides are certified by the Kenya Professional Safari Guides Association (KPSGA) at Bronze, Silver, or Gold levels. They also undergo regular training in first aid, vehicle maintenance, wildlife behavior, and customer service."
        },
        {
          id: 'guides-4',
          question: "What languages can your safari guides speak?",
          answer: "All guides speak fluent English and Swahili. Several are also proficient in German, French, Italian, or Spanish. Please let us know if you need a guide who speaks a specific language."
        },
        {
          id: 'guides-5',
          question: "Can a safari guide help with photos?",
          answer: "Absolutely! Our guides are skilled at positioning the vehicle for optimal lighting and angles. Many have photography training and can advise on camera settings for wildlife shots."
        },
        {
          id: 'guides-6',
          question: "Can your safari tour guide provide water during my safari?",
          answer: "Yes, our vehicles are always stocked with bottled water. Your guide will also provide cool towels and ensure you stay hydrated throughout your game drives."
        },
        {
          id: 'guides-7',
          question: "Can I choose my safari guide?",
          answer: "While we can't guarantee specific guides due to scheduling, you may request a preferred guide when booking. We'll do our best to accommodate your request."
        },
        {
          id: 'guides-8',
          question: "Can safari guides accommodate guests with special needs?",
          answer: "Yes, we have guides trained to assist guests with mobility challenges or other special requirements. Please inform us in advance so we can make appropriate arrangements."
        },
        {
          id: 'guides-9',
          question: "What are the benefits of the jeeps your safari guides use?",
          answer: "Our custom 4x4 Land Cruisers have pop-up roofs for optimal viewing, charging ports, refrigerated coolers, and first aid kits. They're maintained to the highest standards for your comfort and safety."
        },
        {
          id: 'guides-10',
          question: "How can I leave a review for my safari guide?",
          answer: "After your safari, you'll receive an email with a link to review your experience. You can also leave reviews on our website or TripAdvisor page."
        }
      ]
    },
    {
      id: 'travel',
      title: 'Travel Logistics',
      icon: <FaPlane className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'travel-1',
          question: "Do I need a visa to visit Kenya?",
          answer: "Most visitors to Kenya require a visa. Kenya offers an e-visa system where you can apply online before your trip. Single-entry tourist visas cost $50 for most nationalities. The East Africa Tourist Visa ($100) allows travel between Kenya, Uganda, and Rwanda and is recommended if you're visiting multiple countries. We can assist with visa information specific to your nationality when you book your safari."
        },
        {
          id: 'travel-2',
          question: "What vaccinations do I need for Kenya?",
          answer: "Yellow fever vaccination is required for entry into Kenya from certain countries. We also recommend vaccinations for hepatitis A and B, typhoid, and ensuring your routine vaccinations are up to date. Malaria prophylaxis is advised for safari areas. Please consult your doctor or a travel health clinic 6-8 weeks before your trip for personalized medical advice."
        },
        {
          id: 'travel-3',
          question: "How safe is Kenya for tourists?",
          answer: "Kenya is generally safe for tourists, particularly in established safari areas. Like any destination, it's important to exercise common sense precautions. Our guided safaris ensure you're always in the company of knowledgeable professionals who prioritize your safety. We monitor local conditions and follow best practices for wildlife viewing. We also provide comprehensive pre-departure information with safety tips for your trip."
        },
        {
          id: 'travel-4',
          question: "What's the best way to get to Kenya?",
          answer: "Kenya's main international airport is Jomo Kenyatta International Airport (NBO) in Nairobi. Many major airlines offer direct flights from Europe, the Middle East, and some destinations in Asia and North America. For travelers from countries without direct flights, connecting through major hubs like Dubai, Amsterdam, London, or Addis Ababa is common. We can assist with flight recommendations based on your departure location."
        },
        {
          id: 'travel-5',
          question: "What's the currency in Kenya?",
          answer: "The official currency is the Kenyan Shilling (KES). Major credit cards are widely accepted in hotels, restaurants, and shops in urban areas. For smaller purchases and in rural areas, cash is preferred. ATMs are available in major towns and cities. We recommend carrying some US dollars (printed after 2006) for visa fees and emergencies. We'll provide specific currency advice in your pre-departure information."
        },
        {
          id: 'travel-6',
          question: "What's the time difference in Kenya?",
          answer: "Kenya operates on East Africa Time (EAT), which is UTC+3. This means Kenya is 3 hours ahead of Greenwich Mean Time (GMT+3), 8 hours ahead of Eastern Standard Time (EST+8), and 11 hours ahead of Pacific Standard Time (PST+11). Kenya does not observe daylight saving time."
        }
      ]
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      icon: <FaLeaf className="text-[#8B6B3D] mr-2" />,
      faqs: [
        {
          id: 'sustainability-1',
          question: "How do you practice sustainable tourism?",
          answer: "We implement several sustainability practices: carbon offset programs for all our tours, partnerships with eco-friendly lodges and camps, strict waste management policies, support for community-owned conservancies, and education programs for travelers on responsible tourism."
        },
        {
          id: 'sustainability-2',
          question: "What makes Olosuashi different from other tour operators?",
          answer: (
            <div>
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
          )
        },
        {
          id: 'sustainability-3',
          question: "What safety measures do you have in place?",
          answer: "Your safety is our top priority. All our vehicles are regularly serviced and equipped with first aid kits. Our guides are trained in wilderness first aid and emergency procedures. We monitor travel advisories and adjust itineraries as needed to ensure safe experiences."
        },
        {
          id: 'sustainability-4',
          question: "What makes Olosuashi safaris sustainable?",
          answer: "Our safaris are sustainable through: low-impact tourism practices, support for conservation projects (we donate 5% of profits), use of eco-friendly accommodations, employment of local staff, and education programs that promote wildlife protection."
        },
        {
          id: 'sustainability-5',
          question: "How do you reduce carbon emissions?",
          answer: "We minimize our carbon footprint by: optimizing safari routes to reduce fuel consumption, using fuel-efficient vehicles, offsetting emissions through tree planting initiatives, and promoting longer stays to reduce per-day impact."
        },
        {
          id: 'sustainability-6',
          question: "How do you support wildlife conservation efforts?",
          answer: (
            <div>
              <p className="mb-2">We support wildlife conservation through multiple initiatives:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Direct Donations:</span> We donate 5% of our profits to local conservation organizations like the Mara Conservancy and Ol Pejeta Conservancy.</li>
                <li><span className="font-semibold">Supporting Community Conservancies:</span> We prioritize visits to community-owned conservation areas that provide sustainable livelihoods while protecting wildlife.</li>
                <li><span className="font-semibold">Anti-Poaching Support:</span> Contributions to anti-poaching units and ranger training programs.</li>
                <li><span className="font-semibold">Conservation Education:</span> Our guides educate visitors about conservation challenges and solutions.</li>
                <li><span className="font-semibold">Responsible Wildlife Viewing:</span> We follow strict guidelines for wildlife observation to minimize our impact.</li>
              </ul>
              <p className="mt-2">Your safari directly contributes to these conservation efforts, helping protect Kenya's wildlife for future generations.</p>
            </div>
          )
        },
        {
          id: 'sustainability-7',
          question: "How are local communities involved?",
          answer: "We work closely with local communities through: employment opportunities, cultural visits that directly benefit villages, purchasing local products, and supporting community-run conservation initiatives."
        },
        {
          id: 'sustainability-8',
          question: "What safety measures are in place during safaris?",
          answer: (
            <div>
              <p className="mb-2">Your safety is our highest priority. Our comprehensive safety measures include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-semibold">Experienced Guides:</span> All guides are certified in wilderness first aid and emergency procedures.</li>
                <li><span className="font-semibold">Quality Vehicles:</span> Regularly maintained 4x4 vehicles with safety features and emergency equipment.</li>
                <li><span className="font-semibold">Communication:</span> Satellite phones and radios in all vehicles for emergency communication.</li>
                <li><span className="font-semibold">Medical Preparedness:</span> First aid kits in all vehicles and knowledge of nearest medical facilities.</li>
                <li><span className="font-semibold">Wildlife Protocols:</span> Strict guidelines for wildlife viewing to ensure both your safety and animal welfare.</li>
                <li><span className="font-semibold">Security Briefings:</span> Clear safety instructions provided before and during your safari.</li>
                <li><span className="font-semibold">24/7 Support:</span> Emergency contact available throughout your journey.</li>
              </ul>
              <p className="mt-2">We continuously monitor local conditions and have contingency plans for various scenarios.</p>
            </div>
          )
        },
        {
          id: 'sustainability-9',
          question: "What should I pack for a sustainable safari?",
          answer: "We recommend reusable water bottles (we provide filtered water), solar-powered chargers, biodegradable toiletries, clothing in natural colors that blends with the environment, and minimal plastic packaging."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="bg-[#8B6B3D] py-32 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url("/girrafe.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-[#8B6B3D] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto">Find answers to all your questions about Olosuashi Tours</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white py-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="font-medium text-gray-700">Quick Links:</span>
            {faqSections.map(section => (
              <button
                key={`quick-${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className="text-[#8B6B3D] hover:underline font-medium"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* FAQ Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {faqSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition ${activeSection === section.id ? 'bg-[#8B6B3D] text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
              {section.icon}
              <span className="font-medium">{section.title}</span>
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {faqSections.map(section => (
            <div 
              key={section.id} 
              className={`p-6 ${activeSection === section.id ? 'block' : 'hidden'}`}
            >
              <div className="flex items-center mb-6">
                <div className="bg-[#8B6B3D] p-2 rounded text-white mr-3">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.faqs.map(faq => (
                  <div key={faq.id} className="border-b border-gray-200 last:border-0 pb-4">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex justify-between items-center py-4 text-left"
                    >
                      <h3 className="font-medium text-gray-800 text-lg">{faq.question}</h3>
                      <FaChevronDown 
                        className={`text-[#8B6B3D] transition-transform ${expandedFaqs[faq.id] ? 'transform rotate-180' : ''}`}
                      />
                    </button>
                    {expandedFaqs[faq.id] && (
                      <div className="pb-4 text-gray-600">
                        {typeof faq.answer === 'string' ? (
                          <p>{faq.answer}</p>
                        ) : (
                          faq.answer
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Our team is happy to help with any other inquiries you might have about our services.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-6 rounded transition"
            >
              Contact Us
            </Link>
            <Link
              to="/safaris"
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

export default FAQPage;