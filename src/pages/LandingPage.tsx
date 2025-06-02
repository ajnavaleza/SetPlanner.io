import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">SetPlanner.io</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">Create Perfect DJ Sets</h2>
          <p className="text-xl text-gray-400 mb-8">
            SetPlanner.io helps DJs create dynamic and engaging sets using AI and Spotify's vast music library. 
            Get intelligent track suggestions, perfect transitions, and create unforgettable musical journeys.
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1625] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#2A1E3F] rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="#00B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Track Selection</h3>
              <p className="text-gray-400">Input your desired genre and reference artists, and let AI find the perfect tracks for your set.</p>
            </div>

            <div className="bg-[#1A1625] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#2A1E3F] rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke="#00B37E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seamless Flow</h3>
              <p className="text-gray-400">Get a perfectly structured set with smooth transitions and energy progression throughout your performance.</p>
            </div>
          </div>

          <div 
            onClick={() => navigate('/create')}
            className="bg-[#00875F] hover:bg-[#015F43] transition-colors rounded-lg p-6 cursor-pointer text-center"
          >
            <h3 className="text-2xl font-semibold mb-2">Start Creating Your Set</h3>
            <p className="text-gray-200">Generate a custom DJ set plan in minutes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 