import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaClock, FaMapMarkerAlt, FaWeightHanging } from 'react-icons/fa';

const NGODashboard = () => {
      const [requests, setRequests] = useState([]);

      useEffect(() => {
            const fetchRequests = async () => {
                  try {
                        const res = await axios.get('http://localhost:5000/api/ngo/requests');
                        setRequests(res.data);
                  } catch (err) {
                        console.error("Failed to load requests", err);
                  }
            };
            fetchRequests();
      }, []);

      const handleAccept = async (id) => {
            try {
                  await axios.post('http://localhost:5000/api/ngo/accept', { requestId: id });
                  setRequests(prev => prev.filter(r => r._id !== id));
            } catch (err) {
                  alert('Failed to accept pickup');
            }
      };

      return (
            <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
                  <header className="mb-8 flex justify-between items-end">
                        <div>
                              <h1 className="text-3xl font-bold text-white">Pickup Requests</h1>
                              <p className="text-slate-400">Prioritized by urgency and impact.</p>
                        </div>
                        <div className="text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                              {requests.length} Active Request{requests.length !== 1 ? 's' : ''}
                        </div>
                  </header>

                  <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                              {requests.map((req) => (
                                    <motion.div
                                          key={req._id}
                                          layout
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, x: 200 }}
                                          className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-emerald-500/30 transition-colors"
                                    >
                                          {/* Left Side: Indicator & Details */}
                                          <div className="flex items-center gap-6 flex-1">
                                                <div className={`w-2 self-stretch rounded-full ${req.urgencyScore > 80 ? 'bg-red-500 shadow-[0_0_10px_red]' :
                                                            req.urgencyScore > 50 ? 'bg-yellow-500 shadow-[0_0_10px_orange]' : 'bg-green-500'
                                                      }`}></div>

                                                <div>
                                                      <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-bold text-xl text-white">{req.foodId.foodType}</h3>
                                                            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                                                                  {req.foodId.storageCondition}
                                                            </span>
                                                      </div>
                                                      <div className="flex items-center gap-4 text-sm text-slate-400">
                                                            <span className="flex items-center gap-1"><FaWeightHanging className="text-emerald-400" /> {req.foodId.quantity}</span>
                                                            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-blue-400" /> {req.zoneId.areaName}</span>
                                                            <span className="flex items-center gap-1"><FaClock className="text-orange-400" /> {Math.floor(req.urgencyScore)} Urgent Score</span>
                                                      </div>
                                                </div>
                                          </div>

                                          {/* Right Side: Action */}
                                          <div className="flex items-center gap-6">
                                                <div className="text-right hidden md:block">
                                                      <div className="text-2xl font-bold text-white">{req.distanceKm} km</div>
                                                      <div className="text-xs text-slate-500">Distance</div>
                                                </div>

                                                <motion.button
                                                      whileHover={{ scale: 1.05 }}
                                                      whileTap={{ scale: 0.95 }}
                                                      onClick={() => handleAccept(req._id)}
                                                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2"
                                                >
                                                      <FaTruck /> Accept Pickup
                                                </motion.button>
                                          </div>
                                    </motion.div>
                              ))}
                              {requests.length === 0 && (
                                    <motion.div
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          className="text-center py-20 text-slate-500"
                                    >
                                          <p className="text-xl">No pending requests.</p>
                                          <p className="text-sm">Great job keeping hunger at bay!</p>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>
            </div>
      );
};

export default NGODashboard;
