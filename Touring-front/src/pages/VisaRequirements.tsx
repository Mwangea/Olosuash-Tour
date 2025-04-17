import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaPassport, FaCheckCircle, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import { GiWorld } from 'react-icons/gi';

const VisaRequirements = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <div className="bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      {/* Parallax Hero Section */}
      <div ref={ref} className="relative h-[70vh] overflow-hidden">
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0 bg-[url('/eta_hero_img.jpeg')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white font-serif mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
                Kenya eVisa / ETA Requirements
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-white mb-8"
            >
              Apply for your Kenya ETA securely online and get it within 3 days!
            </motion.p>
            <motion.a
              href="https://www.etakenya.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg"
            >
              Apply Now
            </motion.a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Introduction Section */}
        <section className="mb-16 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <GiWorld className="text-5xl text-[#8B6B3D]" />
          </div>
          <h2 className="text-3xl font-bold text-[#2A2A2A] font-serif mb-6">
            Kenya Electronic Travel Authorization (eTA)
          </h2>
          <div className="prose text-gray-600 text-left mx-auto">
            <p className="mb-4">
              All visitors to Kenya including infants and children who intend to travel to the Republic of Kenya must have an approved Electronic Travel Authorisation (eTA) before the start of their journey.
            </p>
            <p className="mb-4 font-semibold">
              Please note that the official ETA application website is <a href="https://www.etakenya.go.ke" className="text-[#8B6B3D] hover:underline">www.etakenya.go.ke</a>
            </p>
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16 bg-[#F8F4EA] rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-[#2A2A2A] font-serif mb-4">
                How to Apply for Kenya eTA
              </h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                  <span>Simple online application process</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                  <span>Typically processed within 3 working days</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-2 flex-shrink-0" />
                  <span>Valid for single entry up to 90 days</span>
                </li>
              </ul>
              <a 
                href="https://www.etakenya.go.ke" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-6 rounded-lg transition duration-300 text-center"
              >
                Start Application
              </a>
            </div>
            <div className="bg-gray-200 flex items-center justify-center p-4">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
  <iframe 
    src="https://player.vimeo.com/video/1005362238"
    title="Kenya eTA Application Process"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    className="w-full h-full"
  ></iframe>
</div>

            </div>
          </div>
        </section>

        {/* Application Steps Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#2A2A2A] font-serif mb-8 text-center">
            Application Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Upload passport information page",
              "Capture a selfie using your webcam",
              "Fill in contact details",
              "Provide arrival/departure details",
              "Complete general information",
              "Make customs declaration",
              "Complete health declaration",
              "Provide travel insurance info",
              "Upload accommodation/flight confirmations",
              "Add any additional documents",
              "Agree to terms and conditions"
            ].map((step, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#8B6B3D]/10 text-[#8B6B3D] w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="font-medium text-gray-800">{step}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Fees and Important Info */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#F8F4EA] rounded-xl p-8">
            <h3 className="text-2xl font-bold text-[#2A2A2A] font-serif mb-4 flex items-center">
              <FaPassport className="text-[#8B6B3D] mr-3" />
              Fees & Processing
            </h3>
            <div className="prose text-gray-600">
              <p className="mb-4">
                <strong>Total Cost:</strong> The standard processing fee is $32.50, plus a bank fee of $1.59, totaling $34.09.
              </p>
              <p className="mb-4">
                Processing time is three (3) working days but in some cases it may take longer. If you need your application processed faster, you can choose expedited processing to receive priority service.
              </p>
              <p className="font-semibold">
                For assistance: Email <a href="mailto:etakenya@ecitizen.go.ke" className="text-[#8B6B3D]">etakenya@ecitizen.go.ke</a> or WhatsApp <a href="https://wa.me/254110922064" className="text-[#8B6B3D]">+254 110 922 064</a>
              </p>
            </div>
          </div>

          <div className="bg-[#F8F4EA] rounded-xl p-8">
            <h3 className="text-2xl font-bold text-[#2A2A22] font-serif mb-4 flex items-center">
              <FaExclamationTriangle className="text-[#8B6B3D] mr-3" />
              Important Notes
            </h3>
            <div className="prose text-gray-600">
              <ul className="space-y-3">
                <li>It is mandatory to use the Government's official website to submit your application</li>
                <li>Applications submitted via third party websites will be automatically denied</li>
                <li>For children under 18, the legal guardian/parent must complete the application</li>
                <li>Your eTA application fee is non-refundable</li>
                <li>You can modify your application before submission</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Exemptions Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#2A2A2A] font-serif mb-8 text-center">
            Who Is Exempt From eTA?
          </h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              <ul className="space-y-4">
                {[
                  "Holders of valid Kenya Passports",
                  "Holders of Kenya Permanent Residence or Work Permits",
                  "Holders of valid Kenya eVISAs",
                  "UN Conventional Travel Document holders",
                  "Diplomatic Missions members (exempt from payment)",
                  "Citizens of East African Partner States (6 months exempt)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-4">
                {[
                  "Passengers in transit through Kenya (same aircraft)",
                  "Passengers arriving/leaving by same ship",
                  "Crew members listed in manifest",
                  "Private aircraft owners refueling",
                  "Children under 16 traveling with parents",
                  "Official government delegations"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-[#8B6B3D] mt-1 mr-3 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16 bg-[#8B6B3D] text-white rounded-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold font-serif mb-8 text-center">
              Benefits of Kenya eTA System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Convenience",
                  desc: "Submit all documents from home before your trip"
                },
                {
                  title: "Peace of Mind",
                  desc: "Know you meet requirements before traveling"
                },
                {
                  title: "Efficiency",
                  desc: "No need to fill forms on plane or at arrival"
                },
                {
                  title: "Verification",
                  desc: "Airlines can easily verify your authorization"
                },
                {
                  title: "Faster Arrival",
                  desc: "Reduces queues for health and immigration checks"
                },
                {
                  title: "Digital Kenya",
                  desc: "Supports Kenya's government digitization efforts"
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#2A2A2A] font-serif mb-6 flex items-center">
            <FaQuestionCircle className="text-[#8B6B3D] mr-3" />
            Terms & Conditions
          </h2>
          <div className="prose text-gray-600">
            <h3 className="text-lg font-semibold text-[#8B6B3D]">Non-Refundable Fees</h3>
            <p>
              Once you submit your eTA application, the fee is non-refundable, and you cannot transfer it to another person. This is also true if your eTA is denied or if for any reason, including a force majeure, there are deviations to your planned journey.
            </p>

            <h3 className="text-lg font-semibold text-[#8B6B3D] mt-6">Disclaimer</h3>
            <p>
              We have taken all reasonable care to ensure that the information provided to you is adequate. We disclaim and exclude all liability for any claim, loss, demand, or damage of any kind arising out of or in connection with this website. All risks associated with the use of this website are assumed by the user.
            </p>

            <h3 className="text-lg font-semibold text-[#8B6B3D] mt-6">Accuracy of Content</h3>
            <p>
              To our best knowledge and intentions, the information on this website is continuously updated and true.
            </p>

            <h3 className="text-lg font-semibold text-[#8B6B3D] mt-6">Minors</h3>
            <p>
              Parents, legal guardians, or accompanying adults are responsible for information submitted when applying for the Republic of Kenya eTA.
            </p>

            <h3 className="text-lg font-semibold text-[#8B6B3D] mt-6">Privacy Policy</h3>
            <p>
              The Government of the Republic of Kenya uses third parties to process the data it collects. One of its processors is Travizory Border Security SA. Its use of the information that you provide to the Government of the Republic of Kenya is governed by its privacy policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VisaRequirements;