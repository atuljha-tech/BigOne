"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaChartLine,
  FaArrowRight,
  FaShieldAlt,
  FaMagic,
  FaMapMarkedAlt,
  FaQrcode,
  FaMobileAlt,
  FaSync,
  FaStar,
  FaCrown,
  FaCheckCircle
} from "react-icons/fa";
import { 
  MdEventSeat, 
  MdDashboard,
  MdLocalOffer,
  MdSecurity,
  MdSpeed,
  MdAutoGraph 
} from "react-icons/md";
import { 
  GiTicket, 
  GiTheaterCurtains,
  GiSmartphone,
  GiPartyPopper 
} from "react-icons/gi";
import { SiLivechat } from "react-icons/si";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState('user');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    tickets: 0
  });
  const [isMounted, setIsMounted] = useState(false);

  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = useMemo(() => {
    // Pre-defined positions to avoid Math.random() during SSR
    return Array.from({ length: 20 }, (_, i) => ({
      x: ((i * 17) % 100) + 'vw',
      y: ((i * 23) % 100) + 'vh',
      delay: (i * 0.1) % 2,
      duration: 3 + (i % 3)
    }));
  }, []);

  useEffect(() => {
    setIsMounted(true);
    
    const interval = setInterval(() => {
      setStats(prev => ({
        users: prev.users < 100000 ? prev.users + 2500 : 100000,
        events: prev.events < 50000 ? prev.events + 1000 : 50000,
        tickets: prev.tickets < 1000000 ? prev.tickets + 25000 : 1000000
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardHover = {
    hover: { 
      y: -10,
      scale: 1.03,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    }
  };

  const floatingTicket = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    { 
      icon: <MdEventSeat className="text-3xl" />, 
      title: "Smart Seat Mapping", 
      desc: "Drag & drop seat editor with real-time updates", 
      color: "from-blue-500 to-cyan-500",
      features: ["3D Visualization", "Drag & Drop", "Real-time Sync"]
    },
    { 
      icon: <FaCalendarAlt className="text-3xl" />, 
      title: "Event Management", 
      desc: "Schedule, promote, and manage events effortlessly", 
      color: "from-purple-500 to-pink-500",
      features: ["Calendar Sync", "Auto Reminders", "Promotion Tools"]
    },
    { 
      icon: <MdAutoGraph className="text-3xl" />, 
      title: "Analytics Dashboard", 
      desc: "Real-time insights, reports, and predictions", 
      color: "from-orange-500 to-red-500",
      features: ["Live Analytics", "Revenue Reports", "Audience Insights"]
    },
    { 
      icon: <FaQrcode className="text-3xl" />, 
      title: "Digital Tickets", 
      desc: "Secure QR code tickets with mobile check-in", 
      color: "from-green-500 to-emerald-500",
      features: ["QR Scanning", "Mobile Wallet", "Instant Delivery"]
    },
    { 
      icon: <SiLivechat className="text-3xl" />, 
      title: "Live Support", 
      desc: "24/7 customer support and chat assistance", 
      color: "from-indigo-500 to-violet-500",
      features: ["Live Chat", "Priority Support", "Help Center"]
    },
    { 
      icon: <MdSecurity className="text-3xl" />, 
      title: "Enterprise Security", 
      desc: "Bank-level encryption and fraud protection", 
      color: "from-yellow-500 to-amber-500",
      features: ["SSL Encryption", "Fraud Detection", "Data Backup"]
    }
  ];

  const roleBenefits = {
    user: [
      "Easy ticket booking",
      "Personalized recommendations",
      "Mobile ticket wallet",
      "Event reminders",
      "Early access to sales"
    ],
    organizer: [
      "Advanced seat mapping",
      "Real-time analytics",
      "Marketing tools",
      "Multi-event management",
      "Revenue tracking"
    ]
  };

  const roles = [
    { id: 'user', label: 'Event Goer', icon: <FaUsers />, color: 'from-blue-500 to-cyan-500' },
    { id: 'organizer', label: 'Event Organizer', icon: <GiTheaterCurtains />, color: 'from-purple-500 to-pink-500' }
  ];

  // Only render stats animation after mount to avoid hydration mismatch
  const displayedStats = isMounted ? stats : { users: 0, events: 0, tickets: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - Use CSS animations instead of inline styles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Floating Particles - Only render on client */}
        {isMounted && particlePositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full"
            initial={{
              x: pos.x,
              y: pos.y
            }}
            animate={{
              y: [pos.y, `calc(${pos.y} - 20px)`, pos.y],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: pos.duration,
              repeat: Infinity,
              delay: pos.delay
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center mb-6 bg-gradient-to-br from-purple-600 to-pink-500 p-4 rounded-3xl shadow-2xl shadow-purple-500/30"
          >
            <GiTicket className="text-4xl text-white" />
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="ml-3 text-4xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
            >
              Seatly
            </motion.span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Where Every Seat
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              Tells a Story
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionizing event management with intelligent seat mapping, 
            real-time booking, and unforgettable experiences.
          </motion.p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { icon: <FaUsers />, value: displayedStats.users.toLocaleString(), label: "Active Users", color: "text-blue-400" },
            { icon: <GiTheaterCurtains />, value: displayedStats.events.toLocaleString(), label: "Events Hosted", color: "text-purple-400" },
            { icon: <FaTicketAlt />, value: displayedStats.tickets.toLocaleString(), label: "Tickets Sold", color: "text-green-400" },
            { icon: <FaStar />, value: "4.9/5", label: "Rating", color: "text-yellow-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 min-w-[180px]"
            >
              <div className={`text-3xl mb-3 ${stat.color}`}>{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-6xl"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardHover}
              whileHover="hover"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden group cursor-pointer"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-all duration-500`}></div>
              
              {/* Icon */}
              <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{feature.icon}</div>
              </div>
              
              {/* Content */}
              <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all">
                {feature.title}
              </h3>
              <p className="relative text-gray-300 mb-4">{feature.desc}</p>
              
              {/* Features List */}
              <div className="relative flex flex-wrap gap-2">
                {feature.features.map((feat, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-white/10 rounded-full text-gray-300">
                    {feat}
                  </span>
                ))}
              </div>
              
              {/* Hover Indicator */}
              <AnimatePresence>
                {hoveredFeature === index && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute bottom-4 right-4 text-white/50"
                  >
                    <FaArrowRight className="text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Role Selection Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-4xl bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-12"
        >
          <div className="p-8 md:p-10">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-3">Start Your Journey</h3>
              <p className="text-gray-300 text-lg">Choose how you want to experience Seatly</p>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Benefits Panel */}
              <div className="md:w-2/5">
                <div className="bg-white/5 rounded-2xl p-6 h-full">
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaCrown className={`${activeRole === 'organizer' ? 'text-yellow-400' : 'text-blue-400'}`} />
                    {activeRole === 'organizer' ? 'Organizer Benefits' : 'User Benefits'}
                  </h4>
                  <ul className="space-y-4">
                    {roleBenefits[activeRole].map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-gray-300"
                      >
                        <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Panel */}
              <div className="md:w-3/5">
                {/* Role Tabs */}
                <div className="flex bg-white/10 rounded-xl p-1 mb-8">
                  {roles.map((role) => (
                    <motion.button
                      key={role.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveRole(role.id)}
                      className={`flex-1 flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                        activeRole === role.id 
                          ? `bg-gradient-to-br ${role.color} text-white shadow-lg` 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="text-2xl mb-2">{role.icon}</div>
                      <span className="text-sm font-semibold">{role.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Register Button */}
                  <Link href={`/auth/register?role=${activeRole}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        <span className="text-lg">Create {activeRole === 'organizer' ? 'Organizer' : 'User'} Account</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </motion.button>
                  </Link>

                  {/* Login Button */}
                  <Link href={`/auth/login?role=${activeRole}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-lg">Sign In as {activeRole === 'organizer' ? 'Organizer' : 'User'}</span>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </motion.button>
                  </Link>
                </div>

                {/* Quick Preview */}
                <div className="mt-8 p-6 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10">
                  <h5 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MdSpeed className="text-blue-400" />
                    Quick Preview
                  </h5>
                  <p className="text-gray-300 text-sm">
                    {activeRole === 'organizer' 
                      ? "Create stunning seat maps, track sales in real-time, and manage multiple events from one dashboard."
                      : "Browse events, book seats with 3D preview, and access all your tickets in a digital wallet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center max-w-3xl"
        >
          <h4 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Event Experience?</h4>
          <p className="text-gray-300 mb-8">
            Join thousands of organizers and attendees who trust Seatly for their event needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all"
              >
                <div className="flex items-center gap-3">
                  <GiPartyPopper />
                  Request Demo
                </div>
              </motion.button>
            </Link>
            
            <Link href="/features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Explore All Features
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {isMounted && (
        <>
          <motion.div
            variants={floatingTicket}
            animate="animate"
            className="absolute top-20 left-5 lg:left-20 text-purple-400/30 text-6xl"
          >
            <GiTicket />
          </motion.div>
          
          <motion.div
            animate={{
              y: [0, 30, 0],
              rotate: [0, -10, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-5 lg:right-20 text-blue-400/30 text-5xl"
          >
            <MdEventSeat />
          </motion.div>

          {/* Mobile Preview */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="hidden lg:block absolute bottom-10 right-10"
          >
            <div className="relative">
              <div className="w-48 h-96 bg-gray-900 rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden">
                <div className="h-8 bg-gray-800 flex items-center justify-center">
                  <div className="w-16 h-4 bg-gray-700 rounded-full"></div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                      <FaTicketAlt className="text-white text-sm" />
                    </div>
                    <div className="h-4 w-20 bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
              <FaMobileAlt className="absolute -top-6 -left-6 text-blue-400/50 text-3xl" />
            </div>
          </motion.div>
        </>
      )}

      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}