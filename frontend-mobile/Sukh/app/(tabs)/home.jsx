import React from 'react';

const HomeDashboard = () => {
  const handleContinueToApp = () => {
    // Handle navigation to main app
    console.log('Continue to app clicked');
  };

  const handleFeatureClick = (feature) => {
    // Handle feature navigation
    console.log(`${feature} clicked`);
  };

  const handleNavigation = (tab) => {
    // Handle bottom navigation
    console.log(`${tab} tab clicked`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      {/* Main Content */}
      <div className="flex-1 px-5 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-10 py-5">
          <h1 className="text-4xl font-bold mb-4 text-white">
            You're not alone
          </h1>
          <p className="text-base text-gray-300 mb-8 leading-relaxed max-w-sm mx-auto">
            We're here to support you through every step of your mental wellness journey. 
            Explore our resources and connect with our community.
          </p>
          <button 
            className="bg-teal-400 hover:bg-teal-500 text-white border-0 rounded-xl py-4 px-8 text-lg font-semibold cursor-pointer transition-colors duration-300 min-w-[200px] active:transform active:translate-y-0.5"
            onClick={handleContinueToApp}
          >
            Continue to App
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Explore Our Features
          </h2>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {/* Chat Feature */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Chat')}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-3xl mb-3 block">💬</div>
              <span className="text-sm font-medium text-white">Chat</span>
            </div>

            {/* Telemanas Helpline */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Telemanas')}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-3xl mb-3 block">📞</div>
              <span className="text-sm font-medium text-white">Call 14416</span>
            </div>

            {/* Book Session */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Book Session')}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="text-3xl mb-3 block">📅</div>
              <span className="text-sm font-medium text-white">Book Session</span>
            </div>

            {/* Stories */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Stories')}
              style={{ animationDelay: '0.4s' }}
            >
              <div className="text-3xl mb-3 block">🎬</div>
              <span className="text-sm font-medium text-white">Stories</span>
            </div>

            {/* Community */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Community')}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-3xl mb-3 block">👥</div>
              <span className="text-sm font-medium text-white">Community</span>
            </div>

            {/* Daily Routine */}
            <div 
              className="bg-gray-800 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 border border-gray-700 hover:bg-gray-700 hover:-translate-y-0.5 animate-fade-in-up"
              onClick={() => handleFeatureClick('Daily Routine')}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="text-3xl mb-3 block">✅</div>
              <span className="text-sm font-medium text-white">Daily Routine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around py-3 z-50">
        <div 
          className="flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 min-w-[60px] bg-gray-600"
          onClick={() => handleNavigation('Home')}
        >
          <div className="text-xl mb-1 text-teal-400">🏠</div>
          <span className="text-xs font-medium text-teal-400">Home</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 min-w-[60px] hover:bg-gray-700"
          onClick={() => handleNavigation('Explore')}
        >
          <div className="text-xl mb-1 text-gray-300">🔍</div>
          <span className="text-xs font-medium text-gray-300">Explore</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 min-w-[60px] hover:bg-gray-700"
          onClick={() => handleNavigation('Dear Diary')}
        >
          <div className="text-xl mb-1 text-gray-300">📔</div>
          <span className="text-xs font-medium text-gray-300">Dear Diary</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 min-w-[60px] hover:bg-gray-700"
          onClick={() => handleNavigation('Community')}
        >
          <div className="text-xl mb-1 text-gray-300">👥</div>
          <span className="text-xs font-medium text-gray-300">Community</span>
        </div>
        
        <div 
          className="flex flex-col items-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-300 min-w-[60px] hover:bg-gray-700"
          onClick={() => handleNavigation('My Profile')}
        >
          <div className="text-xl mb-1 text-gray-300">👤</div>
          <span className="text-xs font-medium text-gray-300">My Profile</span>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;