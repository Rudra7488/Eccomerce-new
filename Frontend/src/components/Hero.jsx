import React from 'react';

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] bg-[#fdfbf0] overflow-hidden flex items-center">
      {/* Background decoration - mimicing the wall/floor split */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#c5eadd] z-0"></div> 
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#dcc6a0] transform -skew-y-2 origin-bottom-right z-0 opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6 text-[#003d29]">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Shopping And <br />
            Department Store.
          </h1>
          <p className="text-gray-700 text-lg max-w-md">
            Shopping is a bit of a relaxing hobby for me, which is sometimes troubling for the bank balance.
          </p>
          <button className="bg-[#003d29] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#002a1c] transition">
            Learn More
          </button>
        </div>

        {/* Image / Graphic Content */}
        <div className="md:w-1/2 relative h-[400px] mt-10 md:mt-0 hidden md:block">
           {/* Abstract platforms and items representation */}
           {/* Platform 1 */}
           <div className="absolute bottom-10 right-10 w-64 h-24 bg-[#facc15] transform skew-x-12 rounded-lg shadow-lg"></div>
           {/* Platform 2 */}
           <div className="absolute bottom-32 right-40 w-48 h-16 bg-[#facc15] transform skew-x-12 rounded-lg shadow-lg"></div>
           
           {/* Floating Items Placeholders (since we don't have the assets) */}
           <div className="absolute bottom-24 right-20 w-32 h-40 bg-blue-500 rounded-md shadow-xl transform -rotate-6 flex items-center justify-center text-white font-bold">Luggage</div>
           <div className="absolute bottom-40 right-48 w-24 h-24 bg-red-500 rounded-md shadow-xl flex items-center justify-center text-white font-bold">Tech</div>
           <div className="absolute bottom-16 right-64 w-20 h-32 bg-yellow-600 rounded-md shadow-xl transform rotate-12 flex items-center justify-center text-white font-bold">Chips</div>
           <div className="absolute top-20 right-20 w-28 h-20 bg-green-500 rounded-md shadow-xl flex items-center justify-center text-white font-bold">Fashion</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
