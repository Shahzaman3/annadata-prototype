import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedCounter = ({ value }) => {
      let spring = useSpring(0, { bounce: 0, duration: 2000 });
      let rounded = useTransform(spring, (latest) => Math.round(latest));

      useEffect(() => {
            spring.set(value);
      }, [value, spring]);

      return <motion.span>{rounded}</motion.span>;
};

const ImpactDashboard = () => {
      const [stats, setStats] = useState({ totalMealsServed: 0, hungerReductionScore: 0 });

      // DUMMY DATA FOR DEMO
      useEffect(() => {
            // Hardcoded stats for demo purposes
            setStats({
                  totalMealsServed: 25430,
                  hungerReductionScore: 72
            });

            // Simulate live updates for "wow" factor
            const interval = setInterval(() => {
                  setStats(prev => ({
                        totalMealsServed: prev.totalMealsServed + Math.floor(Math.random() * 3),
                        hungerReductionScore: prev.hungerReductionScore
                  }));
            }, 5000);

            // Original API call commented out
            /*
            const fetchStats = async () => {
                  try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const res = await axios.get(`${API_URL}/api/impact`);
                        setStats(res.data);
                  } catch (err) {
                        console.error("Failed to load impact stats", err);
                  }
            };
            fetchStats();
            // Poll for updates every 5s for demo effect
            const interval = setInterval(fetchStats, 5000);
            */
            return () => clearInterval(interval);
      }, []);

      return (
            <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto flex flex-col items-center">
                  <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                              Real-Time Impact
                        </h1>
                        <p className="text-slate-400">Tracking our progress towards Zero Hunger (SDG-2).</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* Metric 1: Meals Served */}
                        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                              <h3 className="text-xl text-emerald-300 mb-4 z-10 font-bold uppercase tracking-wider">Meals Served</h3>
                              <div className="text-5xl md:text-8xl font-black text-white z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    <AnimatedCounter value={stats.totalMealsServed} />
                              </div>
                              <div className="mt-4 text-slate-400 h-16 w-full flex items-end justify-center gap-1">
                                    {/* Static Bar Graph Decoration */}
                                    <div className="w-2 h-4 bg-emerald-800 rounded-t"></div>
                                    <div className="w-2 h-8 bg-emerald-700 rounded-t"></div>
                                    <div className="w-2 h-6 bg-emerald-800 rounded-t"></div>
                                    <div className="w-2 h-12 bg-emerald-600 rounded-t"></div>
                                    <div className="w-2 h-10 bg-emerald-500 rounded-t shadow-[0_0_10px_#10b981]"></div>
                                    <div className="w-2 h-14 bg-emerald-400 rounded-t"></div>
                              </div>
                        </div>

                        {/* Metric 2: Hunger Reduction Score */}
                        <div className="glass-panel p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                              <h3 className="text-xl text-blue-300 mb-4 z-10 font-bold uppercase tracking-wider">Hunger Reduction Index</h3>
                              <div className="relative w-48 h-48 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-700" />
                                          <motion.circle
                                                cx="96" cy="96" r="88"
                                                stroke="currentColor" strokeWidth="12" fill="transparent"
                                                className="text-blue-500 drop-shadow-[0_0_10px_#3b82f6]"
                                                strokeDasharray={2 * Math.PI * 88}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - (stats.hungerReductionScore / 100)) }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                          />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                                          {stats.hungerReductionScore}
                                    </div>
                              </div>
                        </div>
                  </div>

                  {/* Bottom Chart / Details */}
                  <div className="mt-8 w-full glass-panel p-8">
                        <h3 className="text-lg font-bold text-white mb-6">Activity Timeline (Last 24h)</h3>
                        <div className="h-40 w-full flex items-end justify-between gap-2 opacity-80">
                              {[30, 45, 20, 60, 75, 50, 90, 80, 40, 60, 70, 100].map((h, i) => (
                                    <motion.div
                                          key={i}
                                          initial={{ height: 0 }}
                                          animate={{ height: `${h}%` }}
                                          transition={{ duration: 0.5, delay: i * 0.1 }}
                                          className="bg-gradient-to-t from-emerald-900 to-emerald-400 w-full rounded-t-sm hover:brightness-125 transition-all"
                                    ></motion.div>
                              ))}
                        </div>
                  </div>
            </div>
      );
};

export default ImpactDashboard;
