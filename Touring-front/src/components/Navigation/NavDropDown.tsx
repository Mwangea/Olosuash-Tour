import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SubMenuItem {
  title: string;
  items?: string[];
}

interface MenuItem {
  title: string;
  subHeaders?: SubMenuItem[];
}

interface NavDropdownProps {
  item: MenuItem;
}

export function NavDropdown({ item }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.subHeaders) return null;

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1 py-2 text-gray-800 hover:text-amber-800 relative group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.title}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-800 group-hover:w-full transition-all duration-300"></span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-64 rounded-lg bg-white py-2 shadow-lg">
          {item.subHeaders.map((subHeader, index) => (
            <div key={index} className="group px-4 py-2">
              <div className="font-medium text-gray-900 hover:text-amber-800 transition-colors duration-200">
                <a href="#" className="block relative group">
                  {subHeader.title}
                </a>
              </div>
              {subHeader.items && (
                <div className="mt-1 space-y-1">
                  {subHeader.items.map((item, itemIndex) => (
                    <a
                      key={itemIndex}
                      href="#"
                      className="block py-1 text-sm text-gray-600 hover:text-amber-800 hover:bg-gray-50 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}