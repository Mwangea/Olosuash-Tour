"use client";
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 448 512" 
    className={className}
    fill="currentColor"
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '+254708414577 '; // Your WhatsApp number
  const contactName = 'Olosuashi'; // Name to display in chat header

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-full p-1">
                <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{contactName}</h3>
                <p className="text-green-100 text-xs">Typically replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Area */}
          <div 
            className="p-4 bg-[#E5DDD5] dark:bg-gray-700 h-[300px] overflow-y-auto"
            style={{
              backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABnSURBVDhP7cxBCsAgDETR6P3P3KWLQqGQhfwM4iJv8ZJk5pxzrbX23mutlVJyzjnGGGutlVIyxhhjrbVSSsYYY4wxxhhjjDHGGGOMsdZaKSVjjDHGGmutlVIyxhhjjLXWSikZY4wxxv4BfAAe6AtLAAAAAElFTkSuQmCC')",
              backgroundRepeat: "repeat"
            }}
          >
            <div className="flex justify-start mb-2">
              <div className="bg-white dark:bg-gray-600 p-3 rounded-lg shadow max-w-[80%]">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  How can I help you? :)
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  23:49
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSubmit} 
            className="p-3 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#25D366] dark:bg-gray-700 dark:text-white text-sm"
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#128C7E] transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative group`}
        aria-label={isOpen ? "Close WhatsApp chat" : "Open WhatsApp chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <WhatsAppIcon className="h-6 w-6" />
            <span className="absolute left-full ml-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
              Contact us
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;