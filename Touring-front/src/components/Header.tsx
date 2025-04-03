/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import defaultAvatar from "/default-avatar.jpg";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/userApi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenuDropdowns, setActiveSubmenuDropdowns] = useState<
    string[]
  >([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { logout } = useAuth();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = localStorage.getItem("user");
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // Fetch user data if not in localStorage
            const profile = await userApi.getProfile();
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    checkAuth();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close mobile menu
      if (
        mobileMenuRef.current &&
        hamburgerRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          document.body.style.overflow = "";
        }
      }

      // Close profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (menuItem: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setActiveDropdown(activeDropdown === menuItem ? null : menuItem);
  };

  const handleMenuItemClick = (item: any, event: React.MouseEvent) => {
    if (item.dropdown) {
      event.preventDefault();
      toggleDropdown(item.name, event);
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubmenuItemClick = (
    itemName: string,
    subItemName: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    event.preventDefault();

    const submenuKey = `${itemName}-${subItemName}`;
    setActiveSubmenuDropdowns((prev) => {
      if (prev.includes(submenuKey)) {
        return prev.filter((item) => item !== submenuKey);
      } else {
        return [...prev, submenuKey];
      }
    });
  };

  const isSubmenuActive = (itemName: string, subItemName: string) => {
    const submenuKey = `${itemName}-${subItemName}`;
    return activeSubmenuDropdowns.includes(submenuKey);
  };

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      dropdown: null,
    },
    {
      name: "About",
      path: "/about",
      dropdown: [
        { name: "About Olosuashi Tours", path: "/about/olosuashi-tours" },
        { name: "Safari Guide", path: "/about/safari-guide" },
        { name: "Sustainability", path: "/about/sustainability" },
      ],
    },
    {
      name: "Kenya Safaris",
      path: "/kenya-safaris",
      dropdown: [
        {
          name: "Nairobi Kenya Safaris",
          submenu: [
            {
              name: "2-4 Day Nairobi Safari Tours",
              path: "/kenya-safaris/nairobi/2-4-day",
            },
            {
              name: "5-8 Day Nairobi Safari Tours",
              path: "/kenya-safaris/nairobi/5-8-day",
            },
          ],
        },
        { name: "Masai Mara Kenya Safaris", path: "/kenya-safaris/masai-mara" },
        { name: "Amboseli Kenya Safaris", path: "/kenya-safaris/amboseli" },
        { name: "Kenya Flight Safaris", path: "/kenya-safaris/flight" },
        {
          name: "Group Tours",
          submenu: [
            {
              name: "Group Tours from Nairobi",
              path: "/kenya-safaris/group/nairobi",
            },
            {
              name: "Group Tours from Kenya Beach",
              path: "/kenya-safaris/group/beach",
            },
          ],
        },
        {
          name: "Nairobi Excursions",
          submenu: [
            {
              name: "Nairobi Day Trips",
              path: "/kenya-safaris/excursions/day-trips",
            },
            {
              name: "Nairobi to Diani Beach Tours",
              path: "/kenya-safaris/excursions/diani",
            },
          ],
        },
        {
          name: "Diani Excursions",
          submenu: [
            {
              name: "Diani One Day Excursions",
              path: "/kenya-safaris/diani/day-excursions",
            },
            {
              name: "Safaris From Diani Beach",
              path: "/kenya-safaris/diani/safaris",
            },
          ],
        },
        {
          name: "Kenya Beach to Nairobi Safaris",
          path: "/kenya-safaris/beach-to-nairobi",
        },
        {
          name: "Kenya Safaris and Diani Beach",
          path: "/kenya-safaris/beach-combination",
        },
      ],
    },
    {
      name: "Experiences",
      path: "/experiences",
      dropdown: [
        { name: "Customized Africa Safaris", path: "/experiences/customized" },
        { name: "Hot Air Balloon Safari", path: "/experiences/balloon" },
        {
          name: "Masai Village Cultural Visit",
          path: "/experiences/masai-village",
        },
        { name: "Nairobi to Mombasa Train", path: "/experiences/train" },
        { name: "Bush Dining", path: "/experiences/bush-dining" },
        { name: "Africa Beach Holidays", path: "/experiences/beach" },
        { name: "Wildebeest Calving Safari", path: "/experiences/calving" },
        { name: "Great Wildebeest Migration", path: "/experiences/migration" },
        { name: "Bird Watching Safaris", path: "/experiences/bird-watching" },
        { name: "Tree Planting", path: "/experiences/tree-planting" },
        { name: "Lion and Rhino Tracking", path: "/experiences/tracking" },
        { name: "Photographic Safaris", path: "/experiences/photographic" },
        { name: "Family Safaris", path: "/experiences/family" },
        { name: "Honeymoon Safaris", path: "/experiences/honeymoon" },
        { name: "Wellness Safaris", path: "/experiences/wellness" },
      ],
    },
    {
      name: "Kenya-Tanzania Safaris",
      path: "/kenya-tanzania-safaris",
      dropdown: [
        {
          name: "Combined Safari Packages",
          path: "/kenya-tanzania-safaris/packages",
        },
        {
          name: "Border Crossing Info",
          path: "/kenya-tanzania-safaris/border-info",
        },
        {
          name: "Best Time to Visit",
          path: "/kenya-tanzania-safaris/best-time",
        },
      ],
    },
    {
      name: "Tanzania Safaris",
      path: "/tanzania-safaris",
      dropdown: [
        {
          name: "Serengeti National Park",
          path: "/tanzania-safaris/serengeti",
        },
        { name: "Ngorongoro Crater", path: "/tanzania-safaris/ngorongoro" },
        { name: "Kilimanjaro Safaris", path: "/tanzania-safaris/kilimanjaro" },
        { name: "Zanzibar Beach Holidays", path: "/tanzania-safaris/zanzibar" },
      ],
    },
    {
      name: "Mountain Climbing",
      path: "/mountain-climbing",
      dropdown: [
        {
          name: "Mount Kenya Climbing",
          path: "/mountain-climbing/mount-kenya",
        },
        {
          name: "Kilimanjaro Climbing",
          path: "/mountain-climbing/kilimanjaro",
        },
        { name: "Preparation Guide", path: "/mountain-climbing/preparation" },
        { name: "Equipment Rental", path: "/mountain-climbing/equipment" },
      ],
    },
    {
      name: "Travel Information",
      path: "/travel-info",
      dropdown: [
        { name: "Visa Requirements", path: "/travel-info/visa" },
        { name: "Health & Vaccinations", path: "/travel-info/health" },
        { name: "Packing List", path: "/travel-info/packing" },
        { name: "Weather Guide", path: "/travel-info/weather" },
        { name: "Cultural Etiquette", path: "/travel-info/culture" },
      ],
    },
    {
      name: "Contact",
      path: "/contact",
      dropdown: null,
    },
  ];

  return (
    <header
      className={`bg-white shadow-sm ${
        isScrolled ? "shadow-md" : ""
      } transition-all duration-300 relative z-50`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/logo-header.png"
                alt="Olosuashi Tours"
                className="h-10 md:h-12"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.path}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#8B6B3D] transition-colors flex items-center"
                  onMouseEnter={() =>
                    item.dropdown && setActiveDropdown(item.name)
                  }
                  onClick={() => !item.dropdown && setActiveDropdown(null)}
                  aria-expanded={activeDropdown === item.name}
                  aria-haspopup={item.dropdown ? "true" : "false"}
                >
                  {item.name}
                  {item.dropdown && (
                    <FaChevronDown
                      className="ml-1 text-xs opacity-70"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.dropdown && (
                  <div
                    className={`absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                      activeDropdown === item.name
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    } group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`dropdown-button-${item.name}`}
                  >
                    <div className="py-1">
                      {item.dropdown.map((subItem) => (
                        <div key={subItem.name} className="relative">
                          {"path" in subItem ? (
                            <Link
                              to={subItem.path ?? ""}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                              role="menuitem"
                            >
                              {subItem.name}
                            </Link>
                          ) : (
                            <div className="relative group/submenu">
                              <div className="flex justify-between items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D] cursor-default">
                                <span>{subItem.name}</span>
                                <FaChevronRight
                                  className="ml-1 text-xs opacity-70"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="absolute left-full top-0 ml-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 invisible group-hover/submenu:visible transition-all duration-200 opacity-0 group-hover/submenu:opacity-100 -translate-x-2 group-hover/submenu:translate-x-0">
                                <div className="py-1">
                                  {subItem.submenu.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.name}
                                      to={nestedItem.path}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                                      role="menuitem"
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center ml-4">
            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  className="flex items-center focus:outline-none"
                  aria-label="User profile"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  onMouseEnter={() => setIsProfileDropdownOpen(true)}
                >
                  <img
                    src={user.profile_picture || defaultAvatar}
                    alt="User profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </button>

                {/* Profile Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    isProfileDropdownOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                  onMouseLeave={() => setIsProfileDropdownOpen(false)}
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/profile/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#F5F0E6] hover:text-[#8B6B3D]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/signin"
                className="ml-4 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#8B6B3D] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8B6B3D]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Full Screen Overlay */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 z-40 bg-white overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "transform translate-y-0"
            : "transform -translate-y-full"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-4 pt-6 pb-20 h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/logo-header.png"
                alt="Olosuashi Tours"
                className="h-10"
              />
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#8B6B3D] focus:outline-none"
              aria-label="Close menu"
            >
              <FaTimes className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {/* Main menu item */}
                <div className="flex items-center">
                  {item.dropdown ? (
                    <div
                      className={`flex-grow py-3 text-base font-medium cursor-pointer ${
                        activeDropdown === item.name
                          ? "text-[#8B6B3D]"
                          : "text-gray-700"
                      }`}
                      onClick={(e) => handleMenuItemClick(item, e)}
                    >
                      {item.name}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex-grow py-3 text-base font-medium ${
                        activeDropdown === item.name
                          ? "text-[#8B6B3D]"
                          : "text-gray-700"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}

                  {item.dropdown && (
                    <button
                      className={`p-2 text-gray-500 focus:outline-none transition-transform duration-200 ${
                        activeDropdown === item.name
                          ? "transform rotate-180 text-[#8B6B3D]"
                          : ""
                      }`}
                      onClick={(e) => toggleDropdown(item.name, e)}
                      aria-expanded={activeDropdown === item.name}
                      aria-label={`Toggle ${item.name} submenu`}
                    >
                      <FaChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="border-b border-gray-100"></div>

                {/* Mobile Dropdown */}
                {item.dropdown && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeDropdown === item.name
                        ? "max-h-screen opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pl-4 py-2 space-y-1">
                      {item.dropdown.map((subItem) => (
                        <div key={subItem.name} className="py-1">
                          {"path" in subItem ? (
                            <Link
                              to={subItem.path ?? ""}
                              className="block py-2 text-base text-gray-600 hover:text-[#8B6B3D]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ) : (
                            <div className="relative">
                              {/* Submenu toggle */}
                              <div className="flex items-center">
                                <span
                                  className={`flex-grow py-2 text-base cursor-pointer ${
                                    isSubmenuActive(item.name, subItem.name)
                                      ? "text-[#8B6B3D]"
                                      : "text-gray-600"
                                  }`}
                                  onClick={(e) =>
                                    handleSubmenuItemClick(
                                      item.name,
                                      subItem.name,
                                      e
                                    )
                                  }
                                >
                                  {subItem.name}
                                </span>
                                <button
                                  className={`p-2 text-gray-500 focus:outline-none transition-transform duration-200 ${
                                    isSubmenuActive(item.name, subItem.name)
                                      ? "transform rotate-180 text-[#8B6B3D]"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleSubmenuItemClick(
                                      item.name,
                                      subItem.name,
                                      e
                                    );
                                  }}
                                  aria-expanded={isSubmenuActive(
                                    item.name,
                                    subItem.name
                                  )}
                                >
                                  <FaChevronDown
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>

                              {/* Nested submenu */}
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                  isSubmenuActive(item.name, subItem.name)
                                    ? "max-h-screen opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="pl-4 py-1 space-y-1">
                                  {subItem.submenu.map((nestedItem) => (
                                    <Link
                                      key={nestedItem.name}
                                      to={nestedItem.path}
                                      className="block py-2 text-base text-gray-600 hover:text-[#8B6B3D]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMobileMenuOpen(false);
                                      }}
                                    >
                                      {nestedItem.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Mobile User Auth Section */}
            <div className="pt-6 pb-2 border-t border-gray-200 mt-6">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center py-3">
                    <div className="flex-shrink-0">
                      <img
                        src={user.profile_picture || defaultAvatar}
                        alt="User profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#8B6B3D]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#8B6B3D]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#8B6B3D]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 text-base font-medium text-gray-700 hover:text-[#8B6B3D]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-base font-medium text-gray-700 hover:text-[#8B6B3D]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#8B6B3D] hover:bg-[#6B4F2D] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
