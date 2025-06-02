import * as React from 'react';
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">SetPlanner.io</h2>
          <p className="text-gray-400">Choose a feature to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Set Plan Card */}
          <div 
            onClick={() => navigate('/create')}
            className="bg-[#1A1625] rounded-lg p-6 cursor-pointer hover:bg-[#1A1625]/80 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#2A1E3F] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7L13 15L9 11L3 17M21 7H15M21 7V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#2A1E3F] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">Create Set Plan</h3>
          </div>

          {/* Double Finder Card */}
          <div className="bg-[#1A1625] rounded-lg p-6 cursor-pointer hover:bg-[#1A1625]/80 transition-colors">
            <div className="absolute top-4 right-4 px-2 py-1 bg-[#015F43] text-[#00B37E] text-xs rounded">Coming Soon</div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#2A1E3F] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L10.2 9.6H4L9 13.2L7.2 19L12 15.6L16.8 19L15 13.2L20 9.6H13.8L12 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#2A1E3F] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">Double Finder</h3>
          </div>

          {/* Gem Finder Card */}
          <div className="bg-[#1A1625] rounded-lg p-6 relative">
            <div className="absolute top-4 right-4 px-2 py-1 bg-[#015F43] text-[#00B37E] text-xs rounded">Coming Soon</div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#2A1E3F] rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7H4M20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7M20 7L16 3H8L4 7M8 11H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-[#2A1E3F] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">Gem Finder</h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 