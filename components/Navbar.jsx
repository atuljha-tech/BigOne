'use client';
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  User, LogOut, Calendar, LayoutDashboard, 
  Menu, X, ChevronDown, Ticket, Home,
  PlusCircle, LogIn, UserPlus
} from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Seatly
                  </div>
                </div>
              </motion.div>
              <span className="hidden lg:inline text-sm font-medium text-gray-400">
                Event Ticketing
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 ml-6">
              <Link href="/">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 group"
                >
                  <Home size={16} className="opacity-60 group-hover:opacity-100" />
                  Home
                </motion.div>
              </Link>
              
              <Link href="/user/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 group"
                >
                  <Calendar size={16} className="opacity-60 group-hover:opacity-100" />
                  My Events
                </motion.div>
              </Link>
              
              {session?.user?.role === 'organizer' && (
                <Link href="/organizer/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 hover:text-white px-4 py-2 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all group"
                  >
                    <LayoutDashboard size={16} className="group-hover:rotate-12 transition-transform" />
                    Organizer
                  </motion.div>
                </Link>
              )}
              
              {session?.user && (
                <Link href="/events/create">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all group"
                  >
                    <PlusCircle size={16} />
                    Create Event
                  </motion.div>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {status === "loading" ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-28 bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
              </div>
            ) : session?.user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur" />
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-semibold border border-white/20">
                      {session.user.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white truncate max-w-[120px]">
                      {session.user.name?.split(' ')[0] || 'User'}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {session.user.role}
                    </div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl shadow-black/50 z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <div className="font-medium text-white truncate">{session.user.name}</div>
                          <div className="text-sm text-gray-400 truncate">{session.user.email}</div>
                        </div>
                        
                        <div className="p-2 space-y-1">
                          <Link href="/user/profile">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                              <User size={16} />
                              Profile Settings
                            </div>
                          </Link>
                          
                          {session.user.role === 'organizer' && (
                            <Link href="/organizer/dashboard">
                              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                                <LayoutDashboard size={16} />
                                Organizer Dashboard
                              </div>
                            </Link>
                          )}
                          
                          <button
                            onClick={() => signOut()}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 group"
                  >
                    <LogIn size={16} />
                    Login
                  </motion.div>
                </Link>
                
                <Link href="/auth/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <UserPlus size={16} />
                    Register
                  </motion.div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {!session?.user && (
                <div className="flex gap-3">
                  <Link href="/auth/login" className="flex-1">
                    <div className="w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium">
                      Login
                    </div>
                  </Link>
                  <Link href="/auth/register" className="flex-1">
                    <div className="w-full text-center px-4 py-3 text-gray-300 hover:text-white rounded-lg border border-white/10 hover:bg-white/5">
                      Register
                    </div>
                  </Link>
                </div>
              )}
              
              <div className="space-y-2">
                <Link href="/">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    <Home size={18} />
                    Home
                  </div>
                </Link>
                
                <Link href="/user/dashboard">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    <Calendar size={18} />
                    My Events
                  </div>
                </Link>
                
                {session?.user?.role === 'organizer' && (
                  <Link href="/organizer/dashboard">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-400 hover:text-cyan-300 bg-blue-600/10 hover:bg-blue-600/20 transition-colors">
                      <LayoutDashboard size={18} />
                      Organizer Dashboard
                    </div>
                  </Link>
                )}
                
                {session?.user && (
                  <Link href="/events/create">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-500/20 text-purple-300 hover:text-white border border-purple-500/30">
                      <PlusCircle size={18} />
                      Create Event
                    </div>
                  </Link>
                )}
              </div>

              {session?.user && (
                <>
                  <div className="px-4 py-3 border-t border-white/10 mt-4">
                    <div className="text-sm font-medium text-white">{session.user.name}</div>
                    <div className="text-xs text-gray-400">{session.user.email}</div>
                  </div>
                  
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}