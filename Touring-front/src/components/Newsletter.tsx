const Newsletter = () => {
    return (
      <div className="py-16 bg-[#F5F0E6]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-800 font-serif">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B6B3D] to-[#5E4B2B]">
                Safari Inspiration
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Subscribe to our newsletter for exclusive offers and safari tips</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-5 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B6B3D] text-gray-700"
            />
            <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white px-8 py-4 rounded-lg font-medium transition duration-300 text-lg">
              Subscribe
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    );
  };
  
  export default Newsletter;