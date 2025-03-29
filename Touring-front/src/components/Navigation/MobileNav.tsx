import  { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navigationData } from './navigationData';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const [openSubMenus, setOpenSubMenus] = useState<number[]>([]);

  const toggleSubMenu = (index: number) => {
    setOpenSubMenus(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 max-h-[80vh] w-full overflow-y-auto bg-white shadow-lg">
          <div className="space-y-1 px-4 py-2">
            {navigationData.map((item, index) => (
              <div key={index} className="border-b border-gray-100 py-2">
                <button 
                  onClick={() => item.subHeaders && toggleSubMenu(index)}
                  className="flex w-full items-center justify-between py-2 text-left text-gray-700 hover:text-brown-600"
                >
                  <span>{item.title}</span>
                  {item.subHeaders && (
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                      openSubMenus.includes(index) ? 'rotate-180' : ''
                    }`} />
                  )}
                </button>
                {item.subHeaders && openSubMenus.includes(index) && (
                  <div className="ml-4 space-y-1">
                    {item.subHeaders.map((subHeader, subIndex) => (
                      <div key={subIndex} className="py-2">
                        <a 
                          href="#"
                          className="block font-medium text-gray-900 hover:text-brown-600"
                        >
                          {subHeader.title}
                        </a>
                        {subHeader.items && (
                          <div className="ml-4 space-y-1 pt-1">
                            {subHeader.items.map((subItem, itemIndex) => (
                              <a
                                key={itemIndex}
                                href="#"
                                className="block py-1 text-sm text-gray-600 hover:text-brown-600"
                              >
                                {subItem}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}