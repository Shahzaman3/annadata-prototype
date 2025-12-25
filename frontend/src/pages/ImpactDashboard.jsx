import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaUsers, FaHistory, FaArrowUp, FaChild, FaUserInjured, FaHome } from 'react-icons/fa';

const AnimatedCounter = ({ value }) => {
      let spring = useSpring(0, { bounce: 0, duration: 2000 });
      let rounded = useTransform(spring, (latest) => Math.round(latest));

      useEffect(() => {
            spring.set(value);
      }, [value, spring]);

      return <motion.span>{rounded}</motion.span>;
};

const ImpactDashboard = () => {
      const [stats, setStats] = useState({
            totalMealsServed: 0,
            hungerReductionScore: 0,
            co2Saved: 0, // kg
            beneficiaries: { children: 0, elderly: 0, families: 0 }
      });
      const [feed, setFeed] = useState([]);

      // DUMMY DATA FOR DEMO
      useEffect(() => {
            // Initial Data
            setStats({
                  totalMealsServed: 25430,
                  hungerReductionScore: 72,
                  co2Saved: 12500,
                  beneficiaries: { children: 45, elderly: 25, families: 30 } // percentages
            });

            const initialFeed = [
                  { id: 1, text: "50kg Rice rescued in South Mumbai", time: "2m ago", type: "rescue" },
                  { id: 2, text: "Community Kitchen served 200 meals", time: "5m ago", type: "serve" },
                  { id: 3, text: "New NGO Partner: 'Feed India' joined", time: "12m ago", type: "join" },
            ];
            setFeed(initialFeed);

            // Simulate live updates
            const interval = setInterval(() => {
                  setStats(prev => ({
                        ...prev,
                        totalMealsServed: prev.totalMealsServed + Math.floor(Math.random() * 5),
                        co2Saved: prev.co2Saved + Math.random() * 2,
                  }));

                  // Add new feed item occasionally
                  if (Math.random() > 0.6) {
                        const activities = [
                              "Surplus food picked up from Hotel Taj",
                              "Donation received from Wedding event",
                              "Volunteer dispatched to Andheri",
                              "100 meals distributed in Dharavi"
                        ];
                        const newActivity = {
                              id: Date.now(),
                              text: activities[Math.floor(Math.random() * activities.length)],
                              time: "Just now",
                              type: "rescue"
                        };
                        setFeed(prev => [newActivity, ...prev.slice(0, 4)]);
                  }
            }, 3000);

            return () => clearInterval(interval);
      }, []);

      return (
            <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto flex flex-col items-center pb-12">
                  <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                              Real-Time Impact
                        </h1>
                        <p className="text-slate-400">Tracking our collective progress towards Zero Hunger (SDG-2).</p>
                  </div>

                  {/* Top Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                        {/* Metric 1: Meals Served */}
                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]">
                              <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                              <h3 className="text-lg text-emerald-300 mb-2 z-10 font-bold uppercase tracking-wider">Meals Served</h3>
                              <div className="text-5xl md:text-6xl font-black text-white z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                    <AnimatedCounter value={stats.totalMealsServed} />
                              </div>
                              <div className="text-xs text-slate-400 mt-2 z-10 flex items-center gap-1">
                                    <FaArrowUp className="text-emerald-400" /> 12% from last week
                              </div>
                        </div>

                        {/* Metric 2: Hunger Reduction Score */}
                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[250px]">
                              <h3 className="text-lg text-blue-300 mb-4 z-10 font-bold uppercase tracking-wider">Hunger Index</h3>
                              <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                          <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                                          <motion.circle
                                                cx="80" cy="80" r="70"
                                                stroke="currentColor" strokeWidth="10" fill="transparent"
                                                className="text-blue-500 drop-shadow-[0_0_10px_#3b82f6]"
                                                strokeDasharray={2 * Math.PI * 70}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                                                animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - (stats.hungerReductionScore / 100)) }}
                                                transition={{ duration: 2, ease: "easeOut" }}
                                          />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                                          {stats.hungerReductionScore}
                                    </div>
                              </div>
                        </div>

                        {/* Metric 3: CO2 Saved */}
                        <div className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[250px]">
                              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
                              <div className="absolute top-4 right-4 text-green-500/20 text-6xl"><FaLeaf /></div>
                              <h3 className="text-lg text-green-300 mb-2 z-10 font-bold uppercase tracking-wider">CO2 Emissions Prevented</h3>
                              <div className="text-5xl md:text-6xl font-black text-white z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                                    <AnimatedCounter value={stats.co2Saved} />
                              </div>
                              <span className="text-sm text-slate-400 mt-2 z-10">kg CO2e</span>
                              <p className="text-xs text-slate-500 mt-4 max-w-[200px]">Equivalent to planting {Math.floor(stats.co2Saved / 20)} trees.</p>
                        </div>
                  </div>

                  {/* Bottom Grid: Activity & Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        {/* Live Activity Feed */}
                        <div className="glass-panel p-6">
                              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <FaHistory className="text-emerald-400" /> Live Rescue Activity
                              </h3>
                              <div className="space-y-4 max-h-[300px] overflow-hidden relative">
                                    <AnimatePresence initial={false}>
                                          {feed.map((item) => (
                                                <motion.div
                                                      key={item.id}
                                                      initial={{ opacity: 0, y: -20, height: 0 }}
                                                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                      exit={{ opacity: 0, x: -20 }}
                                                      transition={{ duration: 0.3 }}
                                                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                                                >
                                                      <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                                      <div>
                                                            <p className="text-sm text-slate-200">{item.text}</p>
                                                            <p className="text-xs text-slate-500">{item.time}</p>
                                                      </div>
                                                </motion.div>
                                          ))}
                                    </AnimatePresence>
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                              </div>
                        </div>

                        {/* Demographics */}
                        <div className="glass-panel p-6">
                              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <FaUsers className="text-blue-400" /> Beneficiary Impact
                              </h3>
                              <div className="space-y-6">
                                    {/* Children */}
                                    <div>
                                          <div className="flex justify-between text-sm mb-1">
                                                <span className="flex items-center gap-2 text-slate-300"><FaChild /> Children</span>
                                                <span className="text-white font-bold">{stats.beneficiaries.children}%</span>
                                          </div>
                                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{ width: `${stats.beneficiaries.children}%` }}
                                                      className="h-full bg-emerald-400"
                                                ></motion.div>
                                          </div>
                                    </div>

                                    {/* Elderly */}
                                    <div>
                                          <div className="flex justify-between text-sm mb-1">
                                                <span className="flex items-center gap-2 text-slate-300"><FaUserInjured /> Elderly</span>
                                                <span className="text-white font-bold">{stats.beneficiaries.elderly}%</span>
                                          </div>
                                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{ width: `${stats.beneficiaries.elderly}%` }}
                                                      className="h-full bg-blue-400"
                                                ></motion.div>
                                          </div>
                                    </div>

                                    {/* Families */}
                                    <div>
                                          <div className="flex justify-between text-sm mb-1">
                                                <span className="flex items-center gap-2 text-slate-300"><FaHome /> Families</span>
                                                <span className="text-white font-bold">{stats.beneficiaries.families}%</span>
                                          </div>
                                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{ width: `${stats.beneficiaries.families}%` }}
                                                      className="h-full bg-purple-400"
                                                ></motion.div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default ImpactDashboard;
