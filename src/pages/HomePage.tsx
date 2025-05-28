import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Trophy, Users, Star, Shield, ArrowRight } from 'lucide-react';

const HomePage = () => {
  useEffect(() => {
    document.title = 'BITS Games - Gaming Tournaments for Friends';
  }, []);
  
  const { isAuthenticated } = useAuth();
  
  const features = [
    {
      icon: <Trophy className="h-10 w-10 text-indigo-500" />,
      title: "Custom Tournaments",
      description: "Create private tournaments for your friend group with flexible rules and game selection"
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-500" />,
      title: "Friend-Based Competitions",
      description: "Invite your friends to join tournaments and track your collective gaming history"
    },
    {
      icon: <Star className="h-10 w-10 text-indigo-500" />,
      title: "Detailed Stats & Rankings",
      description: "Track wins, losses, and performance across different games with personalized rankings"
    },
    {
      icon: <Shield className="h-10 w-10 text-indigo-500" />,
      title: "Secure Communication",
      description: "Chat with friends, discuss strategies, and coordinate game sessions in real-time"
    }
  ];
  
  const games = [
    {
      name: "Combat Master",
      image: "https://images.pexels.com/photos/7915527/pexels-photo-7915527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Counter-Strike: Source",
      image: "https://images.pexels.com/photos/7914464/pexels-photo-7914464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Half-Life",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];
  
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-indigo-600/30 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Level Up Your <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Gaming Competitions</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create tournaments, track wins, and compete with friends. The ultimate platform for managing your gaming squad's competitions and ranking.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {isAuthenticated ? (
              <Link to="/dashboard\" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn-ghost text-lg px-8 py-3">
                  Log In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Featured Games */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Games</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Create tournaments for your favorite games and track your performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div 
              key={index}
              className="relative rounded-xl overflow-hidden h-80 game-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img 
                src={game.image} 
                alt={game.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-end z-10 p-6">
                <h3 className="text-2xl font-bold text-white">{game.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Everything you need to manage gaming tournaments with your friends
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-12 md:py-20 md:px-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Tournament?</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join BITS Games today and start tracking your gaming dominance. Set up tournaments, invite friends, and prove who's the best.
            </p>
            <Link to={isAuthenticated ? "/tournaments" : "/register"} className="inline-flex items-center btn bg-white text-indigo-700 hover:bg-indigo-50 text-lg px-8 py-3">
              {isAuthenticated ? "Create Tournament" : "Sign Up Now"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;