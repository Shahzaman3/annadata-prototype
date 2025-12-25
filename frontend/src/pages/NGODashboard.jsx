import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaMapMarkerAlt, FaWeightHanging, FaCheck } from 'react-icons/fa';

const NGODashboard = () => {
      const [requests, setRequests] = useState([]);

      useEffect(() => {
            const fetchRequests = async () => {
                  try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const res = await axios.get(`${API_URL}/api/ngo/requests`);
                        setRequests(res.data);
                  } catch (err) {
                        console.error("Failed to load requests", err);
                  }
            };
            fetchRequests();
      }, []);

      const handleAccept = async (id) => {
            try {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                  await axios.post(`${API_URL}/api/ngo/accept`, { requestId: id });
                  setRequests(prev => prev.filter(r => r._id !== id));
            } catch (err) {
                  alert('Failed to accept pickup');
            }
      };

      const pendingRequests = requests.length;
      const totalDistance = requests.reduce((acc, r) => acc + r.distanceKm, 0);
      const urgentCount = requests.filter(r => r.urgencyScore > 80).length;

      return (
            <div className="min-h-screen pt-28 px-4 pb-12 max-w-7xl mx-auto">
                  {/* Page Header & Stats */}
                  <div className="mb-10">
                        <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
                        >
                              <div>
                                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                                          Mission Control
                                    </h1>
                                    <p className="text-slate-400 mt-1">Orchestrating surplus food logistics.</p>
                              </div>
                              <div className="flex gap-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                          <div className="text-2xl font-bold text-white">{pendingRequests}</div>
                                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Pending</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                          <div className="text-2xl font-bold text-blue-400">{totalDistance}km</div>
                                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Range</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-center">
                                          <div className="text-2xl font-bold text-red-400">{urgentCount}</div>
                                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">Critical</div>
                                    </div>
                              </div>
                        </motion.div>

                        <div className="h-px w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
                  </div>

                  {/* Requests Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                              {requests.map((req) => (
                                    <motion.div
                                          key={req._id}
                                          layout
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.9 }}
                                          whileHover={{ y: -5 }}
                                          className="relative group bg-slate-800/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all cursor-default"
                                    >
                                          {/* "Ticket" design wrapper */}
                                          <div className="flex h-full">
                                                {/* Left Stub: Urgency Indicator */}
                                                <div className={`w-3 ${req.urgencyScore > 80 ? 'bg-red-500' :
                                                      req.urgencyScore > 50 ? 'bg-yellow-500' : 'bg-emerald-500'
                                                      }`}></div>

                                                {/* Main Content */}
                                                <div className="flex-1 p-5 flex flex-col justify-between relative">
                                                      {/* Decorative Dash Line */}
                                                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-900 rounded-l-full"></div>

                                                      <div className="mb-4">
                                                            <div className="flex justify-between items-start mb-2">
                                                                  <h3 className="font-bold text-xl text-white">{req.foodId.foodType}</h3>
                                                                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${req.urgencyScore > 80 ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                                                        }`}>
                                                                        SCORE: {Math.floor(req.urgencyScore)}
                                                                  </span>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-400">
                                                                  <div className="flex items-center gap-2">
                                                                        <FaWeightHanging className="text-emerald-500/70" /> {req.foodId.quantity}
                                                                  </div>
                                                                  <div className="flex items-center gap-2">
                                                                        <FaMapMarkerAlt className="text-blue-500/70" /> {req.zoneId.areaName}
                                                                  </div>
                                                                  <div className="flex items-center gap-2 col-span-2 text-xs opacity-70">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                                                                        {req.foodId.storageCondition}
                                                                  </div>
                                                            </div>
                                                      </div>

                                                      <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/10">
                                                            <div className="text-center">
                                                                  <div className="text-lg font-bold text-white">{req.distanceKm}<span className="text-sm font-normal text-slate-500">km</span></div>
                                                                  <div className="text-[10px] text-slate-500 uppercase">Distance</div>
                                                            </div>

                                                            <button
                                                                  onClick={() => handleAccept(req._id)}
                                                                  className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold py-2 px-6 rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group-hover:scale-105"
                                                            >
                                                                  <FaTruck /> Accept
                                                            </button>
                                                      </div>
                                                </div>
                                          </div>
                                    </motion.div>
                              ))}
                        </AnimatePresence>
                  </div>

                  {requests.length === 0 && (
                        <div className="text-center py-24">
                              <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                                    <FaCheck className="text-4xl text-emerald-500 opacity-50" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-1">All Clear!</h3>
                              <p className="text-slate-400">No active pickup requests at the moment.</p>
                        </div>
                  )}
            </div>
      );
};

export default NGODashboard;
