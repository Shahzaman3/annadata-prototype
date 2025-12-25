import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { FaUtensils, FaClock, FaThermometerHalf, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DonorSubmission = () => {
      const [formData, setFormData] = useState({
            foodType: '',
            quantity: '',
            cookingTime: '',
            storageCondition: 'Hot'
      });
      const [status, setStatus] = useState(null); // success | error | loading
      const [msg, setMsg] = useState('');
      const formRef = useRef(null);

      useEffect(() => {
            gsap.fromTo(formRef.current,
                  { y: 50, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
      }, []);

      const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

      const handleSubmit = async (e) => {
            e.preventDefault();
            setStatus('loading');

            // Convert local datetime-local to ISO or keep as is? Backend parses it.
            // JS Date parsing should handle it.

            try {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                  const res = await axios.post(`${API_URL}/api/food/submit`, formData);
                  setStatus('success');
                  setMsg(res.data.message);
                  // Reset form partly
                  setFormData(prev => ({ ...prev, foodType: '', quantity: '' }));
            } catch (err) {
                  setStatus('error');
                  setMsg(err.response?.data?.message || 'Submission failed');
            }
      };

      return (
            <div className="min-h-screen pt-24 px-4 flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
                  {/* Background Overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0"></div>

                  <div ref={formRef} className="relative z-10 w-full max-w-md glass-panel p-8 border-t border-emerald-500/30">


                        <div className="text-center mb-8">
                              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
                                    Share a Meal
                              </h2>
                              <p className="text-slate-400 mt-2">Connecting surplus to scarcity.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="space-y-2">
                                    <label className="text-sm text-emerald-400 font-semibold flex items-center gap-2"><FaUtensils /> Food Type</label>
                                    <select
                                          name="foodType"
                                          value={formData.foodType}
                                          onChange={handleChange}
                                          className="w-full glass-input"
                                          required
                                    >
                                          <option value="" disabled className="text-black">Select type...</option>
                                          <option value="Rice & Curry" className="text-black">Rice & Curry</option>
                                          <option value="Breads/Roti" className="text-black">Breads/Roti</option>
                                          <option value="Vegetables" className="text-black">Vegetables</option>
                                          <option value="Fruits" className="text-black">Fruits</option>
                                          <option value="Packaged Goods" className="text-black">Packaged Goods</option>
                                    </select>
                              </div>

                              <div className="space-y-2">
                                    <label className="text-sm text-emerald-400 font-semibold flex items-center gap-2">Quantity</label>
                                    <input
                                          type="text"
                                          name="quantity"
                                          placeholder="e.g. 5 kg or 20 servings"
                                          value={formData.quantity}
                                          onChange={handleChange}
                                          className="w-full glass-input"
                                          required
                                    />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                          <label className="text-sm text-emerald-400 font-semibold flex items-center gap-2"><FaClock /> Cooked At</label>
                                          <input
                                                type="datetime-local"
                                                name="cookingTime"
                                                value={formData.cookingTime}
                                                onChange={handleChange}
                                                className="w-full glass-input text-xs"
                                                required
                                          />
                                    </div>
                                    <div className="space-y-2">
                                          <label className="text-sm text-emerald-400 font-semibold flex items-center gap-2"><FaThermometerHalf /> Storage</label>
                                          <select
                                                name="storageCondition"
                                                value={formData.storageCondition}
                                                onChange={handleChange}
                                                className="w-full glass-input text-xs"
                                          >
                                                <option value="Hot" className="text-black">Hot (&gt;60°C)</option>
                                                <option value="Refrigerated" className="text-black">Refrigerated</option>
                                                <option value="Room Temperature" className="text-black">Room Temp</option>
                                          </select>
                                    </div>
                              </div>

                              <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`w-full glass-btn mt-4 ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                              >
                                    {status === 'loading' ? 'Verifying...' : 'Submit Donation'}
                              </motion.button>
                        </form>

                        <AnimatePresence>
                              {status === 'success' && (
                                    <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0 }}
                                          className="mt-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center gap-3 text-emerald-200"
                                    >
                                          <FaCheckCircle className="text-xl" />
                                          <div>
                                                <h4 className="font-bold">Accepted!</h4>
                                                <p className="text-sm opacity-80">{msg}</p>
                                          </div>
                                    </motion.div>
                              )}
                              {status === 'error' && (
                                    <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0 }}
                                          className="mt-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-3 text-red-200"
                                    >
                                          <FaExclamationCircle className="text-xl" />
                                          <div>
                                                <h4 className="font-bold">Action Required</h4>
                                                <p className="text-sm opacity-80">{msg}</p>
                                          </div>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>
            </div>
      );
};

export default DonorSubmission;
