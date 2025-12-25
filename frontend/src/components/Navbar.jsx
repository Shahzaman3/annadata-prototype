import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaMapMarkedAlt, FaHandHoldingHeart, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
      const location = useLocation();
      const [isOpen, setIsOpen] = useState(false);

      const links = [
            { path: '/donate', label: 'Donate', icon: <FaHeart /> },
            { path: '/map', label: 'Priority Map', icon: <FaMapMarkedAlt /> },
            { path: '/ngo', label: 'NGO Dashboard', icon: <FaHandHoldingHeart /> },
            { path: '/impact', label: 'Impact', icon: <FaChartLine /> },
      ];

      return (
            <nav className="fixed top-0 left-0 w-full z-50 p-4">
                  <div className="glass-panel mx-auto max-w-7xl px-6 py-3 flex justify-between items-center bg-black/40 backdrop-blur-xl relative z-50">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => setIsOpen(false)}>
                              <div className="bg-emerald-500 p-2 rounded-lg text-white font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    A+
                              </div>
                              <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                                    ANNADATA+
                              </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex gap-6">
                              {links.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                          <Link key={link.path} to={link.path} className="relative px-3 py-2 flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-400">
                                                <span className={isActive ? 'text-emerald-400' : 'text-slate-300'}>{link.icon}</span>
                                                <span className={isActive ? 'text-white' : 'text-slate-400'}>{link.label}</span>
                                                {isActive && (
                                                      <motion.div
                                                            layoutId="nav-underline"
                                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                                                            initial={false}
                                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                      />
                                                )}
                                          </Link>
                                    )
                              })}
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                              className="md:hidden text-white text-2xl focus:outline-none"
                              onClick={() => setIsOpen(!isOpen)}
                        >
                              {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                  </div>

                  {/* Mobile Menu Overlay */}
                  <AnimatePresence>
                        {isOpen && (
                              <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute top-20 left-4 right-4 bg-black/90 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col gap-4 md:hidden z-40 shadow-2xl"
                              >
                                    {links.map((link) => {
                                          const isActive = location.pathname === link.path;
                                          return (
                                                <Link
                                                      key={link.path}
                                                      to={link.path}
                                                      onClick={() => setIsOpen(false)}
                                                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'
                                                            }`}
                                                >
                                                      <span className="text-xl">{link.icon}</span>
                                                      <span className="text-lg font-medium">{link.label}</span>
                                                </Link>
                                          )
                                    })}
                              </motion.div>
                        )}
                  </AnimatePresence>
            </nav>
      );
};

export default Navbar;
