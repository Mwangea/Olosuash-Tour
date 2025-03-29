import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About Us */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo-header.png"
                alt="Olosuashi Tours"
                className="h-20 w-40 "
              />
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Experience the authentic African safari with Olosuashi Tours. We
              offer unforgettable wildlife adventures, cultural experiences, and
              mountain treks across Kenya and Tanzania.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="https://www.facebook.com/people/Olosuashi-Mara-Tours/pfbid01C29N5gWbUZbKCuYpP1sH4uPuRNdE5dcCDVV4yKRd9PD81o49nFSfqiohCZ7RCX3l/?rdid=SGPU2SOTpWyyZFxn&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BgBbyii8G%2F"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/olosuashi"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/olosuashi-tours-713b12352/"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Kenya Safaris
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Tanzania Safaris
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Mountain Trekking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Cultural Experiences
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Travel Guides
                </a>
              </li>
              <li>
                <a
                  href="contact"
                  className="text-gray-400 hover:text-amber-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Contact Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  123 Safari Avenue, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href="tel:+254794556500"
                  className="flex items-center gap-3 hover:underline"
                >
                  <Phone className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-sm">+254 794556500</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a
                  href="mailto:info@olosuashi.com"
                  className="flex items-center gap-3 hover:underline"
                >
                  <Mail className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-sm">info@olosuashi.com</span>
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Monday - Friday: 8:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Stay updated with our latest safari packages, travel tips, and
              exclusive offers.
            </p>
            <form className="space-y-2">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Awards and Certifications */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-white text-base font-medium mb-4 text-center">
            Proud Members Of
          </h4>
          <div className="flex flex-wrap justify-center gap-8">
            <div className=" p-3 rounded-md">
              <img
                src="/image.png"
                alt="Kenya Tourism Board"
                className="h-25"
              />
            </div>
            <div className="p-3 rounded-md">
              <img src="/eawls-logo.jpg" alt="eawls" className="h-25" />
            </div>
            <div className=" p-3 rounded-md">
              <img src="/EK-Revised.gif" alt="EKO Tourism" className="h-25" />
            </div>
            <div className=" p-3 rounded-md">
              <img
                src="/logo-safari.png"
                alt="SafariBookings"
                className="h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              &copy; {currentYear} Olosuashi Tours. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="hover:text-amber-500 transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-amber-500 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
