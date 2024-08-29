import React from 'react';
import backgroundImage from '../assets/bg.webp'; // Ensure the correct path
import arrowIcon from '../assets/arrow_icon.png'; // Ensure the correct path to the arrow icon

const AdSection: React.FC = () => {
  const scrollToExplore = () => {
    const exploreSection = document.getElementById('explore-section');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative w-full p-16 flex items-center justify-between shadow-lg" 
      style={{ 
        minHeight: '500px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Gray Transparent Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900 opacity-75"
        style={{ zIndex: 1 }}
      ></div>

      {/* Content Section */}
      <div className="relative z-10 max-w-xl">
        <h1 className="text-5xl font-bold text-white mb-4 border-4 border-white p-2 inline-block">Empower Your Life</h1>
        <h2 className="text-4xl font-semibold text-white mb-6 border-4 border-white p-2 inline-block">Buy, Sell, or Borrow with Ease</h2>
        <p className="text-lg text-white mb-8">
          Discover a platform tailored to buy, sell, or borrow products with real-time notifications and seamless interactions. Make the most of your life with easy access to what you need.
        </p>
        <button 
          onClick={scrollToExplore} 
          className="bg-green-700 text-white font-bold py-3 px-6 rounded-full hover:bg-green-800 flex items-center border-2 border-white"
          style={{ width: '140px' }}
        >
          EXPLORE
          <img src={arrowIcon} alt="Right Arrow" className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AdSection;
