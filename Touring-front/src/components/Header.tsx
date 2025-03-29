import { useState } from "react";
import { Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { navigationData } from "./Navigation/navigationData";
import { MobileNav } from "./Navigation/MobileNav";
import { NavDropdown } from "./Navigation/NavDropDown";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn] = useState(false);

  // Split navigation items into two rows as shown in the design
  const firstRowNavItems = navigationData.slice(0, 4); // Home, About, Kenya Safaris, Experiences
  const secondRowNavItems = navigationData.slice(4); // Kenya-Tanzania, Tanzania, Mountain, Travel, Contact

  return (
    <header className="relative shadow">
      {/* Main background - clean white */}
      <div className="absolute inset-0 bg-white z-0"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Logo, Contact Info, and Sign In row */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/logo-header.png"
                alt="Olosuashi Tours"
                className="h-20 w-40 "
              />
            </a>
          </div>

          {/* Contact Information - Only visible on large screens */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <a
                href="tel:+254794556500"
                className="flex items-center gap-2 hover:underline"
              >
                <Phone className="h-4 w-4 text-amber-800" />
                <span className="text-sm text-gray-800">+254 794556500</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="mailto:info@olosuashi.com"
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="h-4 w-4 text-amber-800" />
                <span className="text-sm text-gray-800">
                  info@olosuashi.com
                </span>
              </a>
            </div>

            <div className="flex items-center gap-3">
            <a
                href="https://www.facebook.com/people/Olosuashi-Mara-Tours/pfbid01C29N5gWbUZbKCuYpP1sH4uPuRNdE5dcCDVV4yKRd9PD81o49nFSfqiohCZ7RCX3l/?rdid=SGPU2SOTpWyyZFxn&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BgBbyii8G%2F"
                className="text-gray-600 hover:text-amber-800 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/olosuashi-tours-713b12352/"
                className="text-gray-600 hover:text-amber-800 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/olosuashi"
                className="text-gray-600 hover:text-amber-800 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Sign In/Profile */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button className="h-8 w-8 rounded-full border-2 border-amber-800">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              </button>
            ) : (
              <a
                href="#"
                className="rounded-md bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition-all"
              >
                Sign In
              </a>
            )}
            {/* Mobile menu button - only show on small screens */}
            <div className="lg:hidden">
              <MobileNav isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>

        {/* Two-row navigation - only on large screens */}
        <nav className="hidden lg:block">
          {/* First row of navigation - all centered */}
          <div className="flex justify-center py-3 border-t border-gray-200">
            <div className="flex justify-center space-x-16">
              {firstRowNavItems.map((item, index) => (
                <div key={index}>
                  {item.subHeaders ? (
                    <NavDropdown item={item} />
                  ) : (
                    <a
                      href="#"
                      className="py-2 text-gray-800 hover:text-amber-800 relative group"
                    >
                      {item.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Second row of navigation */}
          <div className="relative py-3 border-t border-b border-gray-200">
            {/* Light grey background */}
            <div className="absolute inset-0 bg-gray-50 z-0"></div>

            <div className="flex justify-center space-x-16 relative z-10">
              {secondRowNavItems.map((item, index) => (
                <div key={index + firstRowNavItems.length}>
                  {item.subHeaders ? (
                    <NavDropdown item={item} />
                  ) : (
                    <a
                      href="#"
                      className="py-2 text-gray-800 hover:text-amber-800 relative group"
                    >
                      {item.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
