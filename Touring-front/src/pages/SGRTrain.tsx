/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowRight, Clock, MapPin, Palmtree } from "lucide-react";
import { useState } from "react";
import {
  FaTrain,
  FaMapMarkerAlt,
  FaConciergeBell,
  FaSafari,
  FaTaxi,
} from "react-icons/fa";
import { GiTicket, GiSittingDog } from "react-icons/gi";
import { IoTime, IoArrowForward } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";

const SGRTrain = () => {
  const [imageLoaded, setImageLoaded] = useState({
    nairobi: false,
    mombasa: false,
  });
  return (
    <ParallaxProvider>
      <div className="font-sans text-gray-800 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
        {/* Hero Section with Parallax Effect */}
        <div className="relative mb-5 h-[50vh] overflow-hidden">
          <Parallax
            translateY={[-20, 20]}
            style={{
              backgroundImage: `url(/train.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="h-full"
          >
            <div style={{ height: "50vh" }} />
          </Parallax>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center px-4 sm:px-6 md:px-8 w-full max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-serif mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
                  Nairobi to Mombasa Madaraka Express
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-white mb-6">
                The Ultimate Coastal Journey with Olosuashi Tours
              </p>
              <Link to="/tours">
                <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Book Your Journey <IoArrowForward className="ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Intro Section with Image Gallery */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#5E4B2B] font-serif">
                  Discover Kenya's Premier Rail Experience
                </h2>
                <div className="prose text-gray-700">
                  <p className="mb-4">
                    The Madaraka Express offers the most comfortable and scenic
                    way to travel between Nairobi and Mombasa. As Kenya's
                    flagship Standard Gauge Railway (SGR), it combines modern
                    amenities with breathtaking views of Kenya's diverse
                    landscapes.
                  </p>
                  <p>
                    At Olosuashi Tours, we seamlessly integrate this remarkable
                    train journey into your Kenya safari itinerary, ensuring
                    your travel between destinations is as memorable as the
                    destinations themselves.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src="/magnificient-scenary.jpg"
                    alt="Scenic view from train window"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src="/train-exterior.jpg"
                    alt="Madaraka Express exterior"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src="/sgr-2.jpg"
                    alt="Coastal view from train"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition duration-300">
                  <img
                    src="/view-savana.webp"
                    alt="Savannah view from train"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Classes with Comparison Images */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#5E4B2B] font-serif">
              Travel Classes on the Madaraka Express
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* First Class */}
              <div className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/sgr-4.jpg"
                    alt="First Class interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white">
                      First Class
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-full mr-4">
                      <FaConciergeBell size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Premium Comfort</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Spacious 2x2 leather reclining seats</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Complimentary meals and beverages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Power outlets at every seat</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Panoramic windows for optimal views</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Quiet, less crowded environment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Economy Class */}
              <div className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src="/sgr-6.jpg"
                    alt="Economy Class interior"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-bold text-white">
                      Economy Class
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] p-3 rounded-full mr-4">
                      <GiTicket size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Great Value</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Comfortable 3x2 seating configuration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Snack bar with affordable meals</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Clean, air-conditioned coaches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Family-friendly environment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8B6B3D] mr-2 mt-1">•</span>
                      <span>Same great views as First Class</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg overflow-hidden shadow-xl max-w-4xl mx-auto">
  <img
    src="/destinations.jpg" 
    alt="Kenya Standard Gauge Railway train in motion"
    className="w-full h-auto object-cover"
  />
</div>
          </div>
        </section>

        {/* Onboard Experience Gallery */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#5E4B2B] font-serif">
              Onboard Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  img: "/restaurant.jpg",
                  title: "Dining Options",
                  desc: "Enjoy meals from our onboard catering service",
                },
                {
                  img: "/view.jpg",
                  title: "Scenic Views",
                  desc: "Large windows showcase Kenya's landscapes",
                },
                {
                  img: "/comfort.jpg",
                  title: "Travel Comfort",
                  desc: "Spacious legroom and reclining seats",
                },
                {
                  img: "/R.jpg",
                  title: "Entertainment",
                  desc: "Bring your devices with charging ports available",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl shadow-lg h-64"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-white/90">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Schedules & Pricing */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Schedules */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#5E4B2B] font-serif">
                  Madaraka Express Schedules
                </h2>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <IoTime className="text-[#8B6B3D] mr-2" /> Express Service
                  </h3>
                  <ul className="space-y-2 mb-6">
                    <li>Non-stop from Nairobi to Mombasa and vice versa</li>
                    <li>Departure: 3:00 PM</li>
                    <li>Arrival: Around 8:00 PM</li>
                    <li>Perfect for those who want a direct and faster ride</li>
                  </ul>

                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaMapMarkerAlt className="text-[#8B6B3D] mr-2" />{" "}
                    Intercounty Service
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      Stops at key towns: Athi River, Emali, Kibwezi, Mtito
                      Andei, Voi, Miasenyi, and Mariakani
                    </li>
                    <li>Departure: 8:00 AM</li>
                    <li>Arrival: Around 2:00 PM</li>
                    <li>
                      Ideal for travelers visiting Tsavo East/West or exploring
                      Kenya's heartland
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-[#5E4B2B] font-serif">
                  Ticket Prices (As of 2025)
                </h2>

                <div className="bg-white p-6 rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-[#8B6B3D]/10">
                        <tr>
                          <th className="px-4 py-3 text-left">Class</th>
                          <th className="px-4 py-3 text-left">
                            Adult Fare (KES)
                          </th>
                          <th className="px-4 py-3 text-left">
                            Child Fare (KES, Age 3-11)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#8B6B3D]/20">
                          <td className="px-4 py-3">First Class</td>
                          <td className="px-4 py-3">3,000</td>
                          <td className="px-4 py-3">1,500</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">Economy Class</td>
                          <td className="px-4 py-3">1,000</td>
                          <td className="px-4 py-3">500</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <GiSittingDog className="text-[#8B6B3D] mr-2 mt-1 flex-shrink-0" />
                        <span>
                          Children under 3 years travel free if they sit on a
                          parent's lap
                        </span>
                      </li>
                      <li className="flex items-start">
                        <GiTicket className="text-[#8B6B3D] mr-2 mt-1 flex-shrink-0" />
                        <span>
                          ID or passport is required when booking and boarding
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaConciergeBell className="text-[#8B6B3D] mr-2 mt-1 flex-shrink-0" />
                        <span>
                          Olosuashi Tours will handle all train bookings on your
                          behalf when you book a complete travel package with
                          us—no stress, no queues!
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boarding Info */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-amber-900 font-serif">
              How to Board – Train Stations
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Nairobi Terminus */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/Nairobi-terminus.jpg"
                    alt="Nairobi Terminus"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, nairobi: true }))
                    }
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-amber-800">
                    <MapPin className="mr-2" size={24} />
                    Nairobi Terminus (Syokimau)
                  </h3>

                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <MapPin
                        className="mr-3 text-amber-700 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <span>Located 20 km from Nairobi city center</span>
                    </li>
                    <li className="flex items-start">
                      <FaTaxi
                        className="mr-3 text-amber-700 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <span>
                        Easily accessible via cab or Olosuashi private transfer
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Clock
                        className="mr-3 text-amber-700 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <span>Arrive at least 1 hour before departure</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mombasa Terminus */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-64 overflow-hidden">
                  <img
                    src="/Mombasa_Terminus.jpg"
                    alt="Mombasa Terminus"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onLoad={() =>
                      setImageLoaded((prev) => ({ ...prev, mombasa: true }))
                    }
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center text-amber-800">
                    <Palmtree className="mr-2" size={24} />
                    Mombasa Terminus (Miritini)
                  </h3>

                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <MapPin
                        className="mr-3 text-amber-700 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <span>Located 11 km from Mombasa CBD</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight
                        className="mr-3 text-amber-700 mt-1 flex-shrink-0"
                        size={18}
                      />
                      <span>
                        From here, Olosuashi can arrange direct transfers to:
                      </span>
                    </li>
                    <div className="ml-8 mt-2 space-y-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                        <span>Diani Beach</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                        <span>Watamu</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                        <span>Malindi</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                        <span>Shimba Hills Safari</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                        <span>Tsavo East/West</span>
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Travel with Us */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#8B6B3D] text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center font-serif">
              Why Travel by SGR with Olosuashi Tours?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <FaTrain size={24} />,
                  title: "Convenient Travel",
                  desc: "Avoid road traffic and flight delays.",
                },
                {
                  icon: <FaMapMarkerAlt size={24} />,
                  title: "Scenic Views",
                  desc: "Cross Tsavo plains and coastal hills from the comfort of your seat.",
                },
                {
                  icon: <FaConciergeBell size={24} />,
                  title: "Smooth Transitions",
                  desc: "We include train tickets and station transfers in your itinerary.",
                },
                {
                  icon: <GiTicket size={24} />,
                  title: "Safe & Secure",
                  desc: "High-security standards and friendly onboard service.",
                },
                {
                  icon: <FaSafari size={24} />,
                  title: "Safari-Ready",
                  desc: "Stopovers at national parks or continue directly to the beach—your adventure, your way!",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Itinerary */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-[#5E4B2B] font-serif">
              Sample Itinerary Featuring the SGR
            </h2>

            <div className="bg-[#F8F4EA] p-6 rounded-lg">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-[#8B6B3D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold">Day 1: Nairobi Arrival</h4>
                    <p>Nairobi city tour + Giraffe Center</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#8B6B3D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold">Day 2: SGR to Mombasa</h4>
                    <p>
                      Morning transfer to Nairobi Terminus → Board 8:00 AM SGR →
                      Arrive in Mombasa → Transfer to Diani
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#8B6B3D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    3-5
                  </span>
                  <div>
                    <h4 className="font-bold">Days 3-5: Beach Relaxation</h4>
                    <p>
                      Relax on the beach, optional marine safari or cultural
                      tour
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#8B6B3D] text-white rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    6
                  </span>
                  <div>
                    <h4 className="font-bold">Day 6: Return Journey</h4>
                    <p>Return via SGR or continue to Tsavo safari</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5E4B2B] font-serif">
              Book Your Madaraka Express Journey with Olosuashi Today!
            </h2>
            <p className="text-lg mb-8">
              Skip the hassle of booking tickets on your own. Let us include
              your SGR ride in a tailor-made coastal safari or beach holiday
              package. Whether you're a solo traveler, honeymooning couple, or
              family group, we'll make sure your journey is seamless, scenic,
              and memorable.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                to="/contact">
                    <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                Contact Us Now
              </button>
                </Link>
              <Link 
              to='/experience'>
                <button className="bg-white hover:bg-gray-100 text-[#8B6B3D] font-medium py-3 px-6 rounded-lg transition duration-300 border border-[#8B6B3D]">
                View Sample Packages
              </button>
              </Link>
              
            </div>
          </div>
        </section>
      </div>
    </ParallaxProvider>
  );
};

export default SGRTrain;
