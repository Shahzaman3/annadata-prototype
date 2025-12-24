import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { motion } from 'framer-motion';

const HungerMap = () => {
      const [zones, setZones] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
            const fetchZones = async () => {
                  try {
                        const res = await axios.get('http://localhost:5000/api/hunger/zones');
                        setZones(res.data);
                        setLoading(false);
                  } catch (err) {
                        console.error("Failed to load zones", err);
                        setLoading(false);
                  }
            };
            fetchZones();
      }, []);

      const center = [28.6139, 77.2090]; // Default to Delhi (mock center)

      return (
            <div className="h-screen w-full relative pt-16">
                  <div className="absolute top-20 left-4 z-[400] max-w-sm">
                        <motion.div
                              initial={{ x: -100, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="glass-panel p-4"
                        >
                              <h2 className="text-xl font-bold text-white mb-1">Hunger Priority Heatmap</h2>
                              <p className="text-xs text-slate-400 mb-3">Live data from community partners.</p>

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
                                          <div className="glass-panel text-white p-2 min-w-[200px] border-none">
                                                <h3 className="font-bold text-lg mb-2 border-b border-white/20 pb-1">{zone.areaName}</h3>
                                                <div className="space-y-1 text-sm">
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
