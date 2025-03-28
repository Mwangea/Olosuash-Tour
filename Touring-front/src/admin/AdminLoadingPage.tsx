import React from 'react';
import { Map, Mountain, Compass } from 'lucide-react';

const AdminLoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <img 
            src="/title-logo.png" 
            alt="Olosuashi Tours Logo" 
            className="w-24 h-24 animate-pulse"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-[#2D2B2A] mb-4">
          Olosuashi Tours
        </h1>
        
        <div className="flex justify-center space-x-4 mb-6">
          <div className="animate-bounce text-[#8B4513]">
            <Mountain className="w-10 h-10" />
          </div>
          <div className="animate-bounce text-[#2D2B2A] delay-100">
            <Map className="w-10 h-10" />
          </div>
          <div className="animate-bounce text-[#8B4513] delay-200">
            <Compass className="w-10 h-10" />
          </div>
        </div>
        
        <p className="text-xl text-[#2D2B2A] mb-4">
          Loading your adventure...
        </p>
        
        <div className="w-64 mx-auto h-2 bg-[#E8E6E1] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8B4513] animate-loading-bar"
            style={{
              animation: 'loading-bar 2s infinite',
              transformOrigin: 'left'
            }}
          ></div>
        </div>
      </div>
      
      {/* Custom animation styles */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AdminLoadingPage;