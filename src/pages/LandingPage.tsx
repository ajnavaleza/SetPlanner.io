import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music2, Users, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1A1625] to-black text-white overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-black/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            SetPlanner.io
          </h1>
          <button
            onClick={() => navigate('/dj-login')}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/10"
          >
            DJ Login
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-white/5 border border-purple-500/20 backdrop-blur-sm"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              The Ultimate DJ Toolkit
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200"
          >
            DJ Tools Suite
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            SetPlanner.io helps DJs create amazing playlists and engage with their audience in real-time.
            Powered by AI and real-time crowd interaction.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group bg-gradient-to-br from-purple-900/50 via-[#1A1625] to-blue-900/50 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Music2 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Planner</h3>
              <p className="text-gray-400 mb-6">Create perfect playlists using AI and Spotify's vast music library. Get intelligent track suggestions and build personalized sets.</p>
              <button
                onClick={() => navigate('/create')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all rounded-lg py-3 px-4 flex items-center justify-center gap-2 group"
              >
                Create Set List
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group bg-gradient-to-br from-blue-900/50 via-[#1A1625] to-purple-900/50 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-all"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Crowd Voting</h3>
              <p className="text-gray-400 mb-6">Let your audience suggest and vote on songs in real-time. Perfect for engaging with your crowd and playing what they want to hear.</p>
              <button
                onClick={() => navigate('/crowd-voting')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all rounded-lg py-3 px-4 flex items-center justify-center gap-2 group"
              >
                Join Voting
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-900/30 via-[#1A1625] to-blue-900/30 rounded-xl p-8 text-center backdrop-blur-sm border border-white/10"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">For DJs, By DJs</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Whether you're planning your next set or want to interact with your audience,
              we've got the tools you need to create unforgettable experiences.
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage; 