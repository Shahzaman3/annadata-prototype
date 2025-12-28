import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
      FaUserCircle, FaUtensils, FaLeaf, FaMedal,
      FaHistory, FaArrowRight, FaClock, FaCheckCircle,
      FaTruck
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatCard = ({ icon, label, value, subtext, color }) => (
      <motion.div
            whileHover={{ y: -5 }}
            className={`p-5 rounded-2xl border bg-black/20 backdrop-blur-md flex flex-col items-center text-center gap-2 ${color === 'emerald' ? 'border-emerald-500/30 text-emerald-400' :
                  color === 'blue' ? 'border-blue-500/30 text-blue-400' :
                        'border-amber-500/30 text-amber-400'
                  }`}
      >
            <div className={`text-3xl mb-1 ${color === 'emerald' ? 'drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                  color === 'blue' ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                        'drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  }`}>
                  {icon}
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
            <div className="text-sm font-medium uppercase tracking-wider opacity-80">{label}</div>
            {subtext && <div className="text-xs text-slate-500 mt-1">{subtext}</div>}
      </motion.div>
);

const ActivityItem = ({ type, quantity, time, status }) => {
      const statusColors = {
            'Pending': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            'Picked Up': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
            'Delivered': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      };

      const statusIcons = {
            'Pending': <FaClock />,
            'Picked Up': <FaTruck />,
            'Delivered': <FaCheckCircle />,
      };

      return (
            <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
                  <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                              {type === 'Cooked Meal' ? <FaUtensils /> : <FaLeaf />}
                        </div>
                        <div>
                              <div className="font-semibold text-white">{type}</div>
                              <div className="text-sm text-slate-400">{quantity} • {time}</div>
                        </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${statusColors[status] || 'text-slate-400'}`}>
                        {statusIcons[status]}
                        {status}
                  </span>
            </motion.div>
      );
};

const UserDashboard = () => {
      const [user, setUser] = useState(null);
      const [activities, setActivities] = useState([]);
      const [loading, setLoading] = useState(true);

      const getTierStyles = (level) => {
            const l = level?.toLowerCase() || '';
            if (l.includes('gold')) return {
                  text: 'text-amber-400',
                  bg: 'bg-amber-500/20',
                  border: 'border-amber-500/30',
                  glow: 'bg-amber-500/20',
                  progress: 'bg-amber-500',
                  progressShadow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]'
            };
            if (l.includes('silver')) return {
                  text: 'text-slate-300',
                  bg: 'bg-slate-500/20',
                  border: 'border-slate-500/30',
                  glow: 'bg-slate-500/20',
                  progress: 'bg-slate-400',
                  progressShadow: 'shadow-[0_0_10px_rgba(148,163,184,0.5)]'
            };
            if (l.includes('platinum')) return {
                  text: 'text-purple-400',
                  bg: 'bg-purple-500/20',
                  border: 'border-purple-500/30',
                  glow: 'bg-purple-500/20',
                  progress: 'bg-purple-500',
                  progressShadow: 'shadow-[0_0_10px_rgba(168,85,247,0.5)]'
            };
            // Default/Starter
            return {
                  text: 'text-emerald-400',
                  bg: 'bg-emerald-500/20',
                  border: 'border-emerald-500/30',
                  glow: 'bg-emerald-500/20',
                  progress: 'bg-emerald-500',
                  progressShadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            };
      };

      useEffect(() => {
            const fetchDashboardData = async () => {
                  try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const res = await axios.get(`${API_URL}/api/user/dashboard`);
                        if (res.data.success) {
                              setUser(res.data.user);
                              setActivities(res.data.activities);
                        }
                  } catch (error) {
                        console.error("Error fetching dashboard data:", error);
                  } finally {
                        setLoading(false);
                  }
            };
            fetchDashboardData();
      }, []);

      if (loading) {
            return (
                  <div className="min-h-screen pt-32 flex items-center justify-center bg-slate-900 text-emerald-500">
                        <div className="animate-spin text-4xl"><FaHistory /></div>
                  </div>
            );
      }

      if (!user) return null; // Or error state
      const tierStyle = getTierStyles(user.level);

      return (
            <div className="min-h-screen pt-28 px-4 pb-12 bg-slate-900 bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
                  <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-0"></div>

                  <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 glass-panel p-8 bg-black/40 border-emerald-500/20">
                              <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-4xl text-white shadow-xl shadow-emerald-500/20">
                                          <FaUserCircle />
                                    </div>
                                    <div>
                                          <h1 className="text-3xl font-bold text-white">Hello, {user.name}</h1>
                                          <div className="flex items-center gap-3 mt-1">
                                                <span className="text-slate-400 text-sm">{user.email}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                                                      <FaMedal /> {user.level}
                                                </span>
                                          </div>
                                    </div>
                              </div>
                              <Link
                                    to="/donate"
                                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                              >
                                    <FaUtensils /> Donate Food
                              </Link>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <StatCard
                                    icon={<FaUtensils />}
                                    label="Meals Served"
                                    value={user.totalMeals}
                                    color="emerald"
                                    subtext={`You've fed ${user.totalMeals} people!`}
                              />
                              <StatCard
                                    icon={<FaLeaf />}
                                    label="CO₂ Saved"
                                    value={user.co2Saved}
                                    color="emerald"
                                    subtext="Equivalent to 5 trees"
                              />
                              <StatCard
                                    icon={<FaMedal />}
                                    label="Impact Points"
                                    value={user.points}
                                    color="amber"
                                    subtext="Top 5% of Donors"
                              />
                              <StatCard
                                    icon={<FaHistory />}
                                    label="Donations"
                                    value={activities.length}
                                    color="blue"
                                    subtext="Total contributions"
                              />
                        </div>

                        {/* Recent Activity Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Left Column: Activity Feed */}
                              <div className="lg:col-span-2 glass-panel p-6 bg-black/40 border-white/10">
                                    <div className="flex justify-between items-center mb-6">
                                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <FaHistory className="text-emerald-400" /> Recent Activity
                                          </h3>
                                          <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
                                    </div>
                                    <div className="space-y-4">
                                          {activities.map(activity => (
                                                <ActivityItem key={activity.id} {...activity} />
                                          ))}
                                    </div>
                              </div>

                              {/* Right Column: Badges & Next Steps (or Notifications) */}
                              <div className="space-y-6">
                                    <div className={`glass-panel p-6 border transition-colors ${tierStyle.border} ${tierStyle.bg.replace('/20', '/10')}`}>
                                          <h3 className="text-lg font-bold text-white mb-4">Your Impact Level</h3>
                                          <div className="flex flex-col items-center text-center">
                                                <div className="w-24 h-24 mb-4 relative">
                                                      <div className={`absolute inset-0 rounded-full blur-xl animate-pulse ${tierStyle.glow}`}></div>
                                                      <FaMedal className={`w-full h-full relative z-10 ${tierStyle.text}`} />
                                                </div>
                                                <div className={`text-2xl font-bold ${tierStyle.text}`}>{user.level}</div>

                                                {user.nextLevel !== 'Max Level' ? (
                                                      <>
                                                            <p className="text-slate-400 text-sm mt-2">
                                                                  You are just <span className="text-white font-bold">{user.mealsToNext} meals</span> away from {user.nextLevel}!
                                                            </p>
                                                            <div className="w-full h-2 bg-slate-700/50 rounded-full mt-4 overflow-hidden">
                                                                  <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${user.progress}%` }}
                                                                        className={`h-full ${tierStyle.progress} ${tierStyle.progressShadow}`}
                                                                  />
                                                            </div>
                                                      </>
                                                ) : (
                                                      <p className="text-emerald-400 text-sm mt-2 font-bold">You have reached the highest tier!</p>
                                                )}
                                          </div>
                                    </div>

                                    <div className="glass-panel p-6 bg-black/40 border-white/10">
                                          <h3 className="text-lg font-bold text-white mb-4">Quick Tips</h3>
                                          <ul className="space-y-3 text-sm text-slate-300">
                                                <li className="flex gap-2">
                                                      <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                                                      <span>Pack hot food in aluminum foil to retain heat.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                      <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                                                      <span>Separate raw and cooked items.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                      <FaCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
                                                      <span>Ensure surplus is fresh before donating.</span>
                                                </li>
                                          </ul>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default UserDashboard;
