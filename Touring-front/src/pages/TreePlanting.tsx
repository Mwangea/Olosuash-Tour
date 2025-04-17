
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const TreePlanting = () => {
  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-[#F8F4EA] to-[#E9F5FF]">
      {/* Cover Image Section */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
        <img 
          src="/tree1.jpg" 
          alt="Tree Planting Safari in Kenya" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 font-serif ">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F8D17B] to-[#E9B949]">
            Tree Planting Safari Experience in Kenya
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white max-w-3xl mx-auto">
              Nurture Nature While You Explore the Wild
            </p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8F4EA] to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/tree2.jpg" 
                alt="Tree planting in Kenya" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-[#5E4B2B] font-serif">
                Immerse Yourself in Meaningful Conservation
              </h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-6">
                  Immerse yourself in a truly meaningful African safari experience by taking part in a tree-planting activity during your journey. At Olosuashi, we believe that unforgettable wildlife encounters can go hand in hand with preserving the environment.
                </p>
                <p className="mb-6">
                  Our tree-planting safari experiences allow you to contribute directly to Kenya's ambitious goal of planting 15 billion trees by 2030. As you enjoy the stunning wildlife and landscapes of Kenya, you can also take a moment to plant a tree that will help regenerate forests, protect biodiversity, and support local communities for generations to come.
                </p>
                <p>
                  From the iconic plains of the Masai Mara to the urban green zones of Nairobi, this is your chance to leave a positive footprint on Africa's fragile ecosystems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Plant Section */}
      <section id="why" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5E4B2B] font-serif">
              Why Plant Trees on Safari?
            </h2>
            <div className="max-w-4xl mx-auto">
              <img 
                src="/tree8.jpg" 
                alt="Forest ecosystem" 
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
              <div className="prose prose-lg text-gray-700 text-left">
                <p className="mb-4">
                  Trees are the lifeblood of Kenya's ecosystems, supporting wildlife, maintaining clean air, conserving water, and offering shelter and food to countless species.
                </p>
                <p className="mb-6">
                  Sadly, climate change, deforestation, and wildfires have destroyed large areas of forest, with up to 80 percent lost in some regions. By planting trees during your safari, you actively participate in healing the land and restoring balance to nature.
                </p>
                <p>
                  You will not only reduce your own carbon footprint but also become part of a larger conservation effort that protects iconic species and their habitats. Planting trees is a simple but powerful way to give back while enjoying the magic of an African safari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eco Lodges Section */}
      <section id="lodges" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5E4B2B] font-serif">
                Eco-Friendly Safari Lodges and Camps
              </h2>
              <div className="prose prose-lg text-gray-700 mb-6">
                <p className="mb-4">
                  We partner with eco-rated lodges and tented camps across Kenya that actively support reforestation. These accommodations often run hands-on programs that allow guests to participate in planting native tree species, collecting seeds, composting, and more.
                </p>
                <p>
                  Some even coordinate community driven planting events where you can join local schools or villages in their reforestation efforts. Whether you are exploring the Serengeti corridor, the lush Masai Mara, or the highlands near Mount Kenya, your stay can be more than just comfortable it can also be impactful.
                </p>
              </div>
              <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                View Our Eco Partners
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/tree9.jpg" 
                alt="Masai Mara Eco Lodge" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="/tree10.jpg" 
                alt="Mount Kenya Forest Camp" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="/tree11.jpg" 
                alt="Community Partnership Lodge" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="/tree12.jpg" 
                alt="Eco lodge interior" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seedballs Section */}
      <section id="seedballs" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/tree4.jpg" 
                alt="Seedballs closeup" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5E4B2B] font-serif">
                Seedballs: A Simple Way to Reforest
              </h2>
              <div className="prose prose-lg text-gray-700 mb-6">
                <p className="mb-4">
                  One of the most innovative ways to contribute to reforestation in Kenya is through seedballs. These small balls of charcoal dust encase seeds and help protect them from pests, heat, and drought until rainfall triggers germination.
                </p>
                <p>
                  All you need to do is throw them on a walk, during a game drive, or even from a vehicle. Seedballs are widely distributed across Kenya and are an exciting way to bring new growth to areas impacted by deforestation. This creative and eco-friendly method is easy, fun, and effective, making it perfect for travelers of all ages.
                </p>
              </div>
              <button className="bg-[#8B6B3D] hover:bg-[#6B4F2D] text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                Request Seedball Experience
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Urban Forests Section */}
      <section id="urban" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8F4EA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#5E4B2B] font-serif">
              Urban Forest Projects Near Nairobi
            </h2>
            <div className="max-w-4xl mx-auto">
              <img 
                src="/tree7.webp" 
                alt="Urban forest in Nairobi" 
                className="w-full h-96 object-cover rounded-lg mb-8"
              />
              <div className="prose prose-lg text-gray-700 text-left">
  <p className='mb-4'>
    Even if your safari begins or ends in Nairobi, you can still be part of Kenya’s inspiring reforestation movement. Just outside the capital, the Karura and Ngong Road Forests stand as shining examples of how urban green spaces can be restored and protected through community action. These serene forested parks are more than just beautiful retreats from the city they’re living symbols of Kenya’s environmental revival.
  </p>
  <p className='mb-4'>
    At Karura Forest, you’ll find scenic walking and cycling trails, indigenous tree nurseries, and opportunities to plant your own tree leaving behind a green legacy. Ngong Road Forest is also undergoing an exciting transformation, and visitors are welcome to take part in tree-planting initiatives that support long term conservation. Whether you have an hour or an afternoon, your hands-on involvement makes a difference.
  </p>
  <p>
    At Olosuashi, we’re proud to connect our guests with meaningful experiences that blend adventure with purpose. So if you’re planning a safari through Nairobi, don’t miss the chance to help these forests thrive and carry the spirit of regeneration with you into the wild.
  </p>
</div>

            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <img 
                src="/tree5.jpg" 
                alt="Karura Forest" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-3 text-[#5E4B2B]">Karura Forest</h3>
              <p className="text-gray-700 mb-4">
                These green havens offer tree nurseries, jogging trails, and community planting events. Karura alone cultivates over 100,000 indigenous seedlings and welcomes visitors to join in their tree-planting programs.
              </p>
              <Link
              to="/contact">
              <button className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium flex items-center transition">
                Plan Your Visit <IoIosArrowForward className="ml-1" />
              </button>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <img 
                src="/tree6.jpg" 
                alt="Ngong Road Forest" 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold mb-3 text-[#5E4B2B]">Ngong Road Forest</h3>
              <p className="text-gray-700 mb-4">
                We can arrange for you to visit these inspiring spaces and spend some time helping nature recover while exploring serene natural landscapes near the city.
              </p>
              <Link
              to="/contact">
              
              <button className="text-[#8B6B3D] hover:text-[#6B4F2D] font-medium flex items-center transition">
                See Calendar <IoIosArrowForward className="ml-1" />
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#8B6B3D] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-serif">
            Be a Part of Kenya's Green Future
          </h2>
          <div className="prose prose-lg text-white/90 mb-8 mx-auto">
            <p>
              Reforesting Kenya not only enhances the beauty of its wild spaces but also strengthens the country's ecological and economic resilience. By planting trees as part of your safari, you contribute to a greener future that benefits both wildlife and local communities.
            </p>
            <p className="mt-4">
              Whether in remote conservation areas or urban parks, your small act of planting can have a lasting impact. Let us know your interest when booking your safari, and we will tailor your adventure to include time for tree planting.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white hover:bg-gray-100 text-[#8B6B3D] font-medium py-3 px-6 rounded-lg transition duration-300">
              Book Your Planting Safari
            </button>
            <button className="bg-transparent hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition duration-300 border border-white">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TreePlanting;