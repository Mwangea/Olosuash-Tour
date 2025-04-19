import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const EasterOfferPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if offer should be shown (Friday to Monday evening)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = now.getHours();

    // Show from Friday (5) to Monday (1) before 18:00 (6pm)
    const isFridayToSunday = dayOfWeek >= 5; // Friday (5), Saturday (6), Sunday (0)
    const isMondayBeforeEvening = dayOfWeek === 1 && hours < 18;
    
    const shouldShow = isFridayToSunday || isMondayBeforeEvening;
    
    // Also check if user hasn't dismissed it
    const isDismissed = localStorage.getItem('easterOfferDismissed');
    
    if (shouldShow && !isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('easterOfferDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="relative bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-300 rounded-xl shadow-xl overflow-hidden w-80">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500" />
            
            <div className="absolute top-2 right-2">
              <button 
                onClick={handleClose}
                className="text-amber-700 hover:text-amber-900 transition-colors"
                aria-label="Close offer popup"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 border-2 border-amber-300 rounded-full p-2 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                    20%
                  </div>
                </div>
                <h3 className="font-bold text-lg text-amber-900">Easter Special Offer!</h3>
              </div>
              
              <p className="text-amber-800 mb-4">
                Enjoy 20% off our Easter packages. Limited time only until Monday evening!
              </p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-600">
                  🐰 Offer ends soon! 🐣
                </span>
                
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/offers"
                  className="bg-gradient-to-r from-pink-500 to-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  View Offers
                </motion.a>
              </div>
            </div>
            
            {/* Easter decoration */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20" />
            <div className="absolute -bottom-2 -right-4 w-12 h-12 bg-purple-400 rounded-full opacity-20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EasterOfferPopup;