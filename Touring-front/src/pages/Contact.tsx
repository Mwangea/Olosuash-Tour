import { useState, useEffect, useRef } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaPaperPlane, 
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaCheckCircle,
  FaExclamationCircle,
  FaChevronDown
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { Link } from "react-router-dom";

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

type SubmitStatus = {
  success: boolean;
  message: string;
} | null;

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isBusinessHours = (): boolean => {
    const hours = currentTime.getHours();
    const day = currentTime.getDay();
    return (day > 0 && day < 6 && hours >= 9 && hours < 18) ||
           (day === 6 && hours >= 10 && hours < 16);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.message.trim() !== '' &&
      (formData.phone === '' || /^\+?[1-9]\d{1,14}$/.test(formData.phone))
    );
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppClick = () => {
    // First validate the form
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

  // Construct the message with proper line breaks
  const message = `Hello Olosuashi team,

  I'd like to inquire about: ${formData.subject || 'Not provided'}
  Name: ${formData.name || 'Not provided'}
  Email: ${formData.email || 'Not provided'}
  Phone: ${formData.phone || 'Not provided'}
  
  Message:
  ${formData.message || 'Not provided'}`;
  
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/254708414577?text=${encodedMessage}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      const emailSubject = `[Olosuashi Contact] ${formData.subject}`;
    
      const emailBody = `
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
    
        Message:
        ${formData.message}
      `.trim();
    
      window.location.href = `mailto:admin@olosuashi.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
      setSubmitStatus({ 
        success: true, 
        message: 'Your message has been prepared in your email client. Please send it to complete the process.' 
      });
    
      setIsSubmitting(false);
    
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What's your cancellation policy?",
      answer: "We offer free cancellation up to 48 hours before your scheduled tour. After that, a 50% fee applies."
    },
    {
      question: "Do you offer group discounts?",
      answer: "Yes! Groups of 6+ receive 10% off, and groups of 12+ receive 15% off. Contact us for larger groups."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. On-site cash payments may be available."
    },
    {
      question: "How soon will I get a response?",
      answer: "We typically respond within 1 business day, often much sooner during working hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax Effect */}
      <div 
        className="bg-[#8B6B3D] py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-[#8B6B3D] opacity-90"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl max-w-2xl mx-auto">Our team is ready to assist you with any inquiries or booking requests.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and CTA Cards */}
          <div className="space-y-6">
            {/* Compact Contact Form */}
            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-[#8B6B3D] p-2 rounded mr-3">
                  <IoMdSend className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Send Us a Message</h2>
              </div>
              
              {submitStatus && (
                <div className={`mb-4 p-3 rounded ${submitStatus.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'} flex items-start`}>
                  {submitStatus.success ? (
                    <FaCheckCircle className="text-green-500 text-lg mr-2 mt-0.5" />
                  ) : (
                    <FaExclamationCircle className="text-red-500 text-lg mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{submitStatus.message}</p>
                  </div>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1 text-sm font-medium">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.name ? 'border-red-400' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#8B6B3D] text-sm`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.name}
                  </p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1 text-sm font-medium">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-400' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#8B6B3D] text-sm`}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationCircle className="mr-1" /> {errors.email}
                    </p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1 text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-400' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#8B6B3D] text-sm`}
                      placeholder="+254708414577"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center">
                      <FaExclamationCircle className="mr-1" /> {errors.phone}
                    </p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-1 text-sm font-medium">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#8B6B3D] appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmNiY2IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-right-2 text-sm"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking Request">Booking Request</option>
                    <option value="Tour Information">Tour Information</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1 text-sm font-medium">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border ${errors.message ? 'border-red-400' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-[#8B6B3D] text-sm`}
                    placeholder="Please share details about your inquiry..."
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs mt-1 flex items-center">
                    <FaExclamationCircle className="mr-1" /> {errors.message}
                  </p>}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-2 px-4 rounded text-sm flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative group">
                    <button 
                      onClick={handleWhatsAppClick}
                      disabled={!isFormValid()}
                      className={`w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-2 px-3 rounded flex items-center justify-center text-xs ${
                        !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <FaWhatsapp className="mr-1.5" /> WhatsApp
                    </button>
                    {!isFormValid() && (
                      <div className="absolute z-10 hidden group-hover:block bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                        Please fill all required fields first
                      </div>
                    )}
                  </div>
                  <a 
                    href="tel:0708414577"
                    className="bg-gray-800 hover:bg-black text-white py-2 px-3 rounded flex items-center justify-center text-xs"
                  >
                    <FaPhone className="mr-1.5" /> Call Us
                  </a>
                </div>
              </div>
            </div>

            {/* CTA Cards Below Form */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white border border-gray-200 p-5">
                <div className="flex items-start">
                  <div className="bg-[#8B6B3D] p-2 rounded mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Ready to Book Your Experience?</h3>
                    <p className="text-gray-600 text-sm mb-3">Secure your spot now for an unforgettable adventure with our easy online booking system.</p>
                    <Link
                      to="/booking"
                      className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white text-sm font-medium py-2 px-4 rounded transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5">
                <div className="flex items-start">
                  <div className="bg-gray-800 p-2 rounded mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Explore Our Tour Packages</h3>
                    <p className="text-gray-600 text-sm mb-3">Discover our curated selection of premium tours designed to give you the best experience.</p>
                    <Link
                      to="/booking"
                      className="inline-block bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white text-sm font-medium py-2 px-4 rounded transition"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info & Map */}
          <div className="space-y-6">
            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-[#8B6B3D] p-2 rounded mr-3">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Our Information</h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="text-[#8B6B3D] mr-3 mt-1">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Our Location</h3>
                    <p className="text-gray-600 text-sm">Moi Avenue<br />Floor 3, Opposite National Archives</p>
                    <a 
                      href="https://maps.app.goo.gl/sbpwhnSYNaZnMhKj8"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#8B6B3D] hover:underline inline-block mt-1 text-xs"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-[#8B6B3D] mr-3 mt-1">
                    <FaPhone size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Phone Numbers</h3>
                    <p className="text-gray-600 text-sm">
                      <a href="tel:0755854208" className="hover:text-[#8B6B3D] transition">+254 755 854 208</a> (Main)
                    </p>
                    <p className="text-gray-600 text-sm">
                      <a href="tel:0708414577" className="hover:text-[#8B6B3D] transition">+254 708 414 577</a> (24/7 Support)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-[#8B6B3D] mr-3 mt-1">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Email Addresses</h3>
                    <p className="text-gray-600 text-sm">
                      <a href="mailto:admin@olosuashi.com" className="hover:text-[#8B6B3D] transition">admin@olosuashi.com</a> (General)
                    </p>
                    <p className="text-gray-600 text-sm">
                      <a href="mailto:bookings@olosuashi.com" className="hover:text-[#8B6B3D] transition">bookings@olosuashi.com</a> (Reservations)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-[#8B6B3D] mr-3 mt-1">
                    <FaClock size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Working Hours</h3>
                    <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600 text-sm">Sunday: Closed</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isBusinessHours() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isBusinessHours() ? 'We\'re currently open' : 'We\'re currently closed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-[#F5F0E6] p-3 rounded text-center">
                <p className="text-sm text-[#8B6B3D] font-medium">
                  <span className="text-lg">⏱️</span> Average response time: <span className="font-bold">under 10mins</span>
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Connect With Us</h3>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-gray-500 hover:text-[#3b5998] transition">
                    <FaFacebook size={16} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#E1306C] transition">
                    <FaInstagram size={16} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#1DA1F2] transition">
                    <FaTwitter size={16} />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-[#0077B5] transition">
                    <FaLinkedin size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 rounded overflow-hidden">
                {!isMapLoaded && (
                  <div className="bg-gray-100 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-pulse text-gray-400 text-sm">Loading map...</div>
                    </div>
                  </div>
                )}
                
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d13483.055593142177!2d36.8129539!3d-1.2792859!3m2!1i1024!2i768!4f13.1!2m1!1sstandard%20chartered%20office%20nairobi!5e1!3m2!1sen!2ske!4v1743243519393!5m2!1sen!2ske"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  onLoad={() => setIsMapLoaded(true)}
                  className={`transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-0'}`}
                ></iframe>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a 
                  href="https://maps.app.goo.gl/sbpwhnSYNaZnMhKj8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-black text-white py-1.5 px-3 rounded flex items-center justify-center text-xs"
                >
                  <FaMapMarkerAlt className="mr-1" /> Open in Maps
                </a>
                <a 
                  href="https://maps.app.goo.gl/iUJVX7bVnuhJVVcs9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white py-1.5 px-3 rounded flex items-center justify-center text-xs"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Find quick answers to common questions about our services and policies.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-3 border-b border-gray-200 last:border-0">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-4 px-2 text-left focus:outline-none"
                >
                  <h3 className="font-medium text-gray-800">{faq.question}</h3>
                  <FaChevronDown 
                    className={`text-[#8B6B3D] transition-transform duration-200 ${expandedFaqIndex === index ? 'transform rotate-180' : ''}`}
                  />
                </button>
                <div 
                  className={`px-2 pb-4 text-gray-600 text-sm ${expandedFaqIndex === index ? 'block' : 'hidden'}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link 
              to="/faq"
              className="inline-block text-[#8B6B3D] hover:text-[#6B4F2D] font-medium transition"
            >
              View all FAQs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;