import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const HungerMap = () => {
      const [zones, setZones] = useState([]);
      const [loading, setLoading] = useState(true);

      // DUMMY DATA FOR DEMO (INDIA)
      useEffect(() => {
            const dummyZones = [
                  { _id: '1', areaName: 'Dharavi, Mumbai', coordinates: { lat: 19.0434, lng: 72.8567 }, hungerScore: 88, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 45, elderlyPct: 20, lastMealAvgHours: 18 } },
                  { _id: '2', areaName: 'Seemapuri, Delhi', coordinates: { lat: 28.6904, lng: 77.3060 }, hungerScore: 92, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 52, elderlyPct: 15, lastMealAvgHours: 20 } },
                  { _id: '3', areaName: 'Kolkata Slums', coordinates: { lat: 22.5726, lng: 88.3639 }, hungerScore: 78, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 38, elderlyPct: 25, lastMealAvgHours: 14 } },
                  { _id: '4', areaName: 'Varanasi Ghats', coordinates: { lat: 25.3176, lng: 82.9739 }, hungerScore: 65, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 30, elderlyPct: 40, lastMealAvgHours: 12 } },
                  { _id: '5', areaName: 'Bangalore Outskirts', coordinates: { lat: 12.9716, lng: 77.5946 }, hungerScore: 45, color: '#22c55e', priorityLevel: 'Stable', details: { childrenPct: 25, elderlyPct: 10, lastMealAvgHours: 6 } },
                  { _id: '6', areaName: 'Hyderabad Old City', coordinates: { lat: 17.3616, lng: 78.4747 }, hungerScore: 72, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 41, elderlyPct: 22, lastMealAvgHours: 13 } },
                  { _id: '7', areaName: 'Chennai North', coordinates: { lat: 13.0827, lng: 80.2707 }, hungerScore: 55, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 33, elderlyPct: 18, lastMealAvgHours: 10 } },
                  { _id: '8', areaName: 'Jaipur Rural', coordinates: { lat: 26.9124, lng: 75.7873 }, hungerScore: 82, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 48, elderlyPct: 28, lastMealAvgHours: 16 } },
                  { _id: '9', areaName: 'Patna Region', coordinates: { lat: 25.5941, lng: 85.1376 }, hungerScore: 85, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 50, elderlyPct: 12, lastMealAvgHours: 17 } },
                  { _id: '10', areaName: 'Bhopal Lower Lake', coordinates: { lat: 23.2599, lng: 77.4126 }, hungerScore: 60, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 35, elderlyPct: 20, lastMealAvgHours: 11 } },
                  { _id: '11', areaName: 'Jamshedpur Slums', coordinates: { lat: 22.8046, lng: 86.2029 }, hungerScore: 75, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 40, elderlyPct: 18, lastMealAvgHours: 14 } },
            ];

            setZones(dummyZones);
            setLoading(false);

            // Original API call commented out for demo
            /*
            const fetchZones = async () => {
                  try {
                        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const res = await axios.get(`${API_URL}/api/hunger/zones`);
                        setZones(res.data);
                        setLoading(false);
                  } catch (err) {
                        console.error("Failed to load zones", err);
                        setLoading(false);
                  }
            };
            fetchZones();
            */
      }, []);

      const center = [28.6139, 77.2090]; // Default to Delhi
      const [showPanel, setShowPanel] = useState(window.innerWidth > 768);
      const [filterLevel, setFilterLevel] = useState('All');
      const [searchTerm, setSearchTerm] = useState('');

      const filteredZones = zones.filter(zone => {
            const matchesSearch = zone.areaName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterLevel === 'All' || zone.priorityLevel === filterLevel;
            // Also map 'Stable' correctly if needed, my data uses 'Stable', 'Moderate', 'Critical'
            return matchesSearch && matchesFilter;
      });

      return (
            <div className="h-screen w-full relative pt-24 bg-slate-900">
                  {/* Controls Overlay: Search & Filter (Bottom Right) */}
                  <div className="absolute bottom-8 right-4 z-[400] w-[90%] md:w-auto flex flex-col gap-3 pointer-events-none items-end">
                        {/* Search Bar */}
                        <div className="pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-xl flex items-center gap-3 w-full md:w-80 shadow-xl order-last md:order-first">
                              <div className="text-slate-400 pl-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                              </div>
                              <input
                                    type="text"
                                    placeholder="Search regions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-transparent border-none text-white text-sm focus:ring-0 w-full placeholder-slate-500"
                              />
                        </div>

                        {/* Filter Pills */}
                        <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide justify-end w-full">
                              {['All', 'Critical', 'Moderate', 'Stable'].map(level => (
                                    <button
                                          key={level}
                                          onClick={() => setFilterLevel(level)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-all whitespace-nowrap border ${filterLevel === level
                                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                                : 'bg-black/40 text-slate-400 border-white/10 hover:bg-white/10'
                                                }`}
                                    >
                                          {level}
                                    </button>
                              ))}
                        </div>
                  </div>

                  {/* Info Panel Toggle (Mobile Only - visible when panel hidden) */}
                  {!showPanel && (
                        <button
                              onClick={() => setShowPanel(true)}
                              className="md:hidden absolute top-28 right-4 z-[400] bg-emerald-500 text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                        >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                  )}

                  {/* Floating Info Panel (Top Right) */}
                  <AnimatePresence>
                        {showPanel && (
                              <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    className="absolute top-28 right-4 z-[400] w-auto max-w-[280px] md:w-80 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl text-white"
                              >
                                    <div className="flex justify-between items-start mb-4">
                                          <div>
                                                <h2 className="text-lg font-bold flex items-center gap-2">
                                                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                      Live Priority Map
                                                </h2>
                                                <p className="text-xs text-slate-400">Real-time hunger index visualization</p>
                                          </div>
                                          <button onClick={() => setShowPanel(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">✕</button>
                                    </div>

                                    <div className="space-y-3">
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                                                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span>
                                                <div className="flex-1">
                                                      <div className="text-xs font-bold text-red-300">Critical Priority</div>
                                                      <div className="text-[10px] text-slate-400">Immediate intervention needed</div>
                                                </div>
                                          </div>
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                                                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_orange]"></span>
                                                <div className="flex-1">
                                                      <div className="text-xs font-bold text-yellow-300">Moderate Warning</div>
                                                      <div className="text-[10px] text-slate-400">At risk, requires monitoring</div>
                                                </div>
                                          </div>
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
                                                <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_green]"></span>
                                                <div className="flex-1">
                                                      <div className="text-xs font-bold text-green-300">Stable</div>
                                                      <div className="text-[10px] text-slate-400">Sufficient supply currently</div>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
                                          <div className="bg-emerald-500/10 rounded-lg p-2">
                                                <div className="text-2xl font-bold text-emerald-400">{zones.length}</div>
                                                <div className="text-[10px] text-emerald-200/50 uppercase tracking-wider">Monitored Zones</div>
                                          </div>
                                          <div className="bg-red-500/10 rounded-lg p-2">
                                                <div className="text-2xl font-bold text-red-400">
                                                      {zones.filter(z => z.priorityLevel === 'Critical').length}
                                                </div>
                                                <div className="text-[10px] text-red-200/50 uppercase tracking-wider">Critical Zones</div>
                                          </div>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>

                  <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="w-full h-full rounded-none outline-none">
                        <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {!loading && filteredZones.map((zone) => (
                              <CircleMarker
                                    key={zone._id}
                                    center={[zone.coordinates.lat, zone.coordinates.lng]}
                                    pathOptions={{
                                          color: zone.color,
                                          fillColor: zone.color,
                                          fillOpacity: 0.6,
                                          weight: 1
                                    }}
                                    radius={Math.max(zone.hungerScore / 4, 8)}
                              >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-tooltip">
                                          <span className="font-bold">{zone.areaName}</span>
                                    </Tooltip>
                                    <Popup className="glass-popup">
                                          <div className="min-w-[200px] text-slate-800 p-1">
                                                <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-2">
                                                      <h3 className="font-bold text-lg">{zone.areaName}</h3>
                                                      <span className="px-2 py-0.5 text-xs text-white rounded-full font-bold" style={{ backgroundColor: zone.color }}>{zone.hungerScore}</span>
                                                </div>
                                                <div className="space-y-2 text-xs">
                                                      <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded">
                                                            <span className="font-semibold text-slate-500">Children at Risk</span>
                                                            <span className="font-bold">{zone.details.childrenPct}%</span>
                                                      </div>
                                                      <div className="flex justify-between items-center bg-slate-100 p-1.5 rounded">
                                                            <span className="font-semibold text-slate-500">Avg Wait Time</span>
                                                            <span className="font-bold">{zone.details.lastMealAvgHours} hrs</span>
                                                      </div>
                                                </div>
                                          </div>
                                    </Popup>
                              </CircleMarker>
                        ))}
                  </MapContainer>
            </div>
      );
};

export default HungerMap;
