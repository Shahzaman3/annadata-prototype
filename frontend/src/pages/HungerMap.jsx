import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const HungerMap = () => {
      const [zones, setZones] = useState([]);
      const [loading, setLoading] = useState(true);

      // DUMMY DATA FOR DEMO (INDIA FOCUS)
      useEffect(() => {
            const dummyZones = [
                  { _id: '1', areaName: 'Dharavi, Mumbai', coordinates: { lat: 19.0434, lng: 72.8567 }, hungerScore: 88, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 45, elderlyPct: 20, lastMealAvgHours: 18 } },
                  { _id: '2', areaName: 'Seemapuri, Delhi', coordinates: { lat: 28.6904, lng: 77.3060 }, hungerScore: 92, color: '#ef4444', priorityLevel: 'Critical', details: { childrenPct: 52, elderlyPct: 15, lastMealAvgHours: 20 } },
                  { _id: '3', areaName: 'Kolkata Slums', coordinates: { lat: 22.5726, lng: 88.3639 }, hungerScore: 78, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 38, elderlyPct: 25, lastMealAvgHours: 14 } },
                  { _id: '4', areaName: 'Varanasi Ghats', coordinates: { lat: 25.3176, lng: 82.9739 }, hungerScore: 65, color: '#eab308', priorityLevel: 'Moderate', details: { childrenPct: 30, elderlyPct: 40, lastMealAvgHours: 12 } },
                  { _id: '5', areaName: 'Bangalore Outskirts', coordinates: { lat: 12.9716, lng: 77.5946 }, hungerScore: 45, color: '#22c55e', priorityLevel: 'Stable', details: { childrenPct: 25, elderlyPct: 10, lastMealAvgHours: 8 } },
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

      const center = [28.6139, 77.2090]; // Default to Delhi (mock center)

      const [showPanel, setShowPanel] = useState(window.innerWidth > 768);

      return (
            <div className="h-screen w-full relative pt-24">
                  {/* Floating Info Panel */}
                  <div className="absolute top-28 right-4 z-[400] w-[90%] md:max-w-sm flex flex-col items-end">
                        <button
                              onClick={() => setShowPanel(!showPanel)}
                              className="md:hidden mb-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold"
                        >
                              {showPanel ? 'Hide Info' : 'Show Map Info'}
                        </button>

                        <AnimatePresence>
                              {showPanel && (
                                    <motion.div
                                          initial={{ x: 20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          exit={{ x: 20, opacity: 0 }}
                                          className="glass-panel p-4 w-full"
                                    >
                                          <div className="flex justify-between items-start">
                                                <div>
                                                      <h2 className="text-xl font-bold text-white mb-1">Hunger Priority Heatmap</h2>
                                                      <p className="text-xs text-slate-400 mb-3">Live data from community partners.</p>
                                                </div>
                                                <button
                                                      onClick={() => setShowPanel(false)}
                                                      className="hidden md:block text-slate-400 hover:text-white"
                                                >
                                                      ✕
                                                </button>
                                          </div>

                                          <div className="flex flex-col gap-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                      <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span>
                                                      <span className="text-slate-300">Critical Priority (&gt;80)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                      <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_orange]"></span>
                                                      <span className="text-slate-300">Moderate Warning (50-80)</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                      <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_green]"></span>
                                                      <span className="text-slate-300">Stable (&lt;50)</span>
                                                </div>
                                          </div>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>

                  <MapContainer center={center} zoom={11} scrollWheelZoom={true} className="w-full h-full">
                        <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {!loading && zones.map((zone) => (
                              <CircleMarker
                                    key={zone._id}
                                    center={[zone.coordinates.lat, zone.coordinates.lng]}
                                    pathOptions={{
                                          color: zone.color,
                                          fillColor: zone.color,
                                          fillOpacity: 0.6,
                                          weight: 2
                                    }}
                                    radius={zone.hungerScore / 3} // Radius proportional to hunger score
                              >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                          <div className="text-center">
                                                <h3 className="font-bold text-base">{zone.areaName}</h3>
                                                <div className="text-xs font-mono mt-1">
                                                      Hunger Score: <span style={{ color: zone.color }} className="font-bold">{zone.hungerScore}</span>
                                                </div>
                                          </div>
                                    </Tooltip>
                                    <Popup>
                                          <div className="p-2 min-w-[200px] text-slate-800">
                                                <h3 className="font-bold text-lg mb-2 border-b border-slate-200 pb-1">{zone.areaName}</h3>
                                                <div className="space-y-1 text-sm font-medium">
                                                      <p className="flex justify-between"><span>Priority:</span> <span style={{ color: zone.color }}>{zone.priorityLevel}</span></p>
                                                      <p className="flex justify-between"><span>Children:</span> <span>{zone.details.childrenPct}%</span></p>
                                                      <p className="flex justify-between"><span>Elderly:</span> <span>{zone.details.elderlyPct}%</span></p>
                                                      <p className="flex justify-between"><span>Avg Fasting:</span> <span>{zone.details.lastMealAvgHours} hrs</span></p>
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
