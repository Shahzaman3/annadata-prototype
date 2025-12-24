import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaMapMarkedAlt, FaHandHoldingHeart, FaChartLine } from 'react-icons/fa';

const Navbar = () => {
      const location = useLocation();

      const links = [
            { path: '/donate', label: 'Donate', icon: <FaHeart /> },
            { path: '/map', label: 'Priority Map', icon: <FaMapMarkedAlt /> },
            { path: '/ngo', label: 'NGO Dashboard', icon: <FaHandHoldingHeart /> },
            { path: '/impact', label: 'Impact', icon: <FaChartLine /> },
      ];

      return (
            <nav className="fixed top-0 left-0 w-full z-50 p-4">
                  <div className="glass-panel mx-auto max-w-5xl px-6 py-3 flex justify-between items-center bg-black/40 backdrop-blur-xl">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="bg-emerald-500 p-2 rounded-lg text-white font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    A+
                              </div>
                              <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                                    ANNADATA+
                              </span>
                        </Link>

                        <div className="flex gap-6">
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
                  </div>
            </nav>
      );
};

export default Navbar;
