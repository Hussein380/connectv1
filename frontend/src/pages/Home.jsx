import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LampContainer } from '../components/ui/Lamp';
import { ChevronDown, GraduationCap, Users, Briefcase, ArrowRight } from 'lucide-react';
import SignInDialog from '../components/ui/SignInDialog';

const Home = () => {
  const [showMore, setShowMore] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-cyan-500" />,
      title: "For Students",
      description: "Connect with experienced mentors and discover educational opportunities tailored to your goals."
    },
    {
      icon: <Users className="w-8 h-8 text-cyan-500" />,
      title: "For Mentors",
      description: "Share your expertise, guide students, and create meaningful impact in their academic journey."
    },
    {
      icon: <Briefcase className="w-8 h-8 text-cyan-500" />,
      title: "Opportunities",
      description: "Access scholarships, internships, and research opportunities all in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="absolute top-0 right-0 p-6 z-50">
        <SignInDialog />
      </nav>

      {/* Hero Section */}
      <LampContainer>
        <div className="flex flex-col items-center">
          {/* Title positioned in the light */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center space-y-4 mb-40"
          >
            <h1 className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-8xl">
              Scholars
            </h1>
            <h2 className="bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl">
              Connect
            </h2>
          </motion.div>

          {/* Description and buttons positioned below the lamp */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative mt-80 space-y-8 text-center"
          >
            <p className="text-slate-400 text-xl max-w-2xl px-4 leading-relaxed">
              Step into the light of knowledge.
              <br />
              Connect with mentors, discover opportunities,
              <br />
              and illuminate your path to academic excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-center"
              >
                Get Started
              </Link>
              <button
                onClick={() => setShowMore(true)}
                className="px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 justify-center"
              >
                Learn More <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </LampContainer>

      {/* Features Section */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="max-w-6xl mx-auto px-4 py-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-slate-900 p-8 rounded-lg border border-slate-800 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-200 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-20"
            >
              <h2 className="text-3xl font-bold text-slate-200 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                Join our community of mentors and students. Create your account now and start exploring opportunities.
              </p>
              <Link
                to="/register"
                className="px-8 py-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors inline-flex items-center gap-2"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home; 