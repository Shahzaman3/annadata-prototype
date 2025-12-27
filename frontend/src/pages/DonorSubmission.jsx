import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
      FaUtensils, FaClock, FaThermometerHalf, FaCheckCircle,
      FaExclamationCircle, FaBreadSlice, FaCarrot, FaAppleAlt,
      FaBoxOpen, FaLeaf, FaHandHoldingHeart
} from 'react-icons/fa';

const FoodTypeCard = ({ icon, label, selected, onClick }) => (
      <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selected
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/50'
                  }`}
      >
            <div className="text-2xl">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
      </motion.div>
);

const DonorSubmission = () => {
      const [formData, setFormData] = useState({
            foodType: '',
            customFoodType: '',
            quantity: '',
            cookingTime: '',
            expiryDate: '',
            storageCondition: 'Hot'
      });
      const [foodCategory, setFoodCategory] = useState('cooked'); // 'cooked' | 'raw'
      const [impact, setImpact] = useState(0);
      const [status, setStatus] = useState(null); // success | error | loading
      const [msg, setMsg] = useState('');
      const formRef = useRef(null);
      const dateInputRef = useRef(null);

      useEffect(() => {
            gsap.fromTo(formRef.current,
                  { y: 50, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
      }, []);

      const calculateImpact = (qtyStr) => {
            const qty = parseFloat(qtyStr);
            if (!isNaN(qty)) {
                  // Heuristic: 1kg ~ 4 meals (250g per meal)
                  setImpact(Math.floor(qty * 4));
            } else {
                  setImpact(0);
            }
      };

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            if (name === 'quantity') calculateImpact(value);
      };

      const handleFoodSelect = (type) => setFormData(prev => ({ ...prev, foodType: type }));
      const handleStorageSelect = (type) => setFormData(prev => ({ ...prev, storageCondition: type }));

      const formatTimeNow = () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return now.toISOString().slice(0, 16);
      }

      const handleSubmit = async (e) => {
            e.preventDefault();
            setStatus('loading');

            try {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                  // Prepare payload - only send cookingTime if cooked food, custom type if 'Other'
                  const payload = {
                        ...formData,
                        foodType: formData.foodType === 'Other' ? formData.customFoodType : formData.foodType,
                        category: foodCategory,
                        cookingTime: foodCategory === 'cooked'
                              ? (formData.cookingTime || new Date().toISOString())
                              : null,
                        expiryDate: foodCategory === 'raw' ? formData.expiryDate : null
                  };

                  const res = await axios.post(`${API_URL}/api/food/submit`, payload);
                  setStatus('success');
                  setMsg(res.data.message);
                  setFormData({
                        foodType: '',
                        customFoodType: '',
                        quantity: '',
                        cookingTime: '',
                        expiryDate: '',
                        storageCondition: 'Hot'
                  });
                  setFoodCategory('cooked');
                  setImpact(0);
            } catch (err) {
                  setStatus('error');
                  setMsg(err.response?.data?.message || 'Submission failed');
            }
      };

      return (
            <div className="min-h-screen pt-32 px-4 pb-12 flex flex-col items-center bg-[url('https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-fixed">
                  {/* Background Overlay */}
                  <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-0"></div>

                  <div ref={formRef} className="relative z-10 w-full max-w-2xl glass-panel p-5 md:p-8 border-t border-emerald-500/30 overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="text-center mb-8 relative">
                              <div className="inline-block p-3 rounded-full bg-emerald-500/10 mb-3 border border-emerald-500/20 text-emerald-400 text-2xl">
                                    <FaHandHoldingHeart />
                              </div>
                              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-cyan-300">
                                    Share a Meal
                              </h2>
                              <p className="text-slate-400 mt-2 text-sm">Your surplus could be someone's sustenance.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                              {/* New: Category Toggle */}
                              <div className="grid grid-cols-2 gap-4 p-1 bg-black/20 rounded-2xl">
                                    <button
                                          type="button"
                                          onClick={() => setFoodCategory('cooked')}
                                          className={`py-3 md:py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${foodCategory === 'cooked'
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                    >
                                          <FaUtensils className="text-xl" />
                                          <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Cooked Meal</span>
                                    </button>
                                    <button
                                          type="button"
                                          onClick={() => setFoodCategory('raw')}
                                          className={`py-3 md:py-4 rounded-xl flex flex-col items-center gap-2 transition-all ${foodCategory === 'raw'
                                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                    >
                                          <FaLeaf className="text-xl" />
                                          <span className="text-xs md:text-sm font-bold uppercase tracking-wide">Raw Ingredients</span>
                                    </button>
                              </div>

                              {/* Section 1: Food Type */}
                              <div className="space-y-3">
                                    <label className="text-sm text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                          <FaUtensils /> Select Item
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                          {foodCategory === 'cooked' ? (
                                                <>
                                                      <FoodTypeCard icon={<FaUtensils />} label="Rice & Curry" selected={formData.foodType === 'Rice & Curry'} onClick={() => handleFoodSelect('Rice & Curry')} />
                                                      <FoodTypeCard icon={<FaBreadSlice />} label="Breads" selected={formData.foodType === 'Breads/Roti'} onClick={() => handleFoodSelect('Breads/Roti')} />
                                                      <FoodTypeCard icon={<FaBoxOpen />} label="Packaged" selected={formData.foodType === 'Packaged Goods'} onClick={() => handleFoodSelect('Packaged Goods')} />
                                                      <FoodTypeCard icon={<FaHandHoldingHeart />} label="Other" selected={formData.foodType === 'Other'} onClick={() => handleFoodSelect('Other')} />
                                                </>
                                          ) : (
                                                <>
                                                      <FoodTypeCard icon={<FaCarrot />} label="Vegetables" selected={formData.foodType === 'Vegetables'} onClick={() => handleFoodSelect('Vegetables')} />
                                                      <FoodTypeCard icon={<FaAppleAlt />} label="Fruits" selected={formData.foodType === 'Fruits'} onClick={() => handleFoodSelect('Fruits')} />
                                                      <FoodTypeCard icon={<FaBoxOpen />} label="Packaged" selected={formData.foodType === 'Packaged Goods'} onClick={() => handleFoodSelect('Packaged Goods')} />
                                                      <FoodTypeCard icon={<FaLeaf />} label="Grains" selected={formData.foodType === 'Grains'} onClick={() => handleFoodSelect('Grains')} />
                                                      <FoodTypeCard icon={<FaHandHoldingHeart />} label="Other" selected={formData.foodType === 'Other'} onClick={() => handleFoodSelect('Other')} />
                                                </>
                                          )}
                                    </div>
                                    <input type="hidden" name="foodType" value={formData.foodType} required />

                                    <AnimatePresence>
                                          {formData.foodType === 'Other' && (
                                                <motion.div
                                                      initial={{ opacity: 0, height: 0 }}
                                                      animate={{ opacity: 1, height: 'auto' }}
                                                      exit={{ opacity: 0, height: 0 }}
                                                      className="mt-3 overflow-hidden"
                                                >
                                                      <input
                                                            type="text"
                                                            name="customFoodType"
                                                            placeholder="Please specify the food item..."
                                                            value={formData.customFoodType}
                                                            onChange={handleChange}
                                                            className="w-full glass-input"
                                                            required={formData.foodType === 'Other'}
                                                      />
                                                </motion.div>
                                          )}
                                    </AnimatePresence>
                              </div>

                              {/* Section 2: Quantity & Impact */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                          <label className="text-sm text-emerald-400 font-semibold uppercase tracking-wider">Quantity (kg)</label>
                                          <div className="relative">
                                                <input
                                                      type="number"
                                                      name="quantity"
                                                      placeholder="0.0"
                                                      value={formData.quantity}
                                                      onChange={handleChange}
                                                      className="w-full glass-input text-2xl font-mono focus:ring-emerald-500/50"
                                                      required
                                                      min="0.1"
                                                      step="0.1"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">KG</span>
                                          </div>
                                          <div className="flex gap-2">
                                                {[5, 10, 20].map(val => (
                                                      <button
                                                            key={val}
                                                            type="button"
                                                            onClick={() => {
                                                                  const newVal = (parseFloat(formData.quantity || 0) + val).toFixed(1);
                                                                  setFormData(prev => ({ ...prev, quantity: newVal }));
                                                                  calculateImpact(newVal);
                                                            }}
                                                            className="px-2 py-1 text-xs rounded border border-white/10 hover:bg-white/10 text-slate-400 transition-colors"
                                                      >
                                                            +{val}kg
                                                      </button>
                                                ))}
                                          </div>
                                    </div>

                                    {/* Impact Estimator Card */}
                                    <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                                          <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">Estimated Impact</span>
                                          <div className="text-4xl font-black text-white flex items-center gap-2">
                                                <FaLeaf className="text-emerald-500 text-2xl" />
                                                {impact || 0}
                                          </div>
                                          <span className="text-sm text-emerald-300 font-medium">Meals Served</span>
                                    </div>
                              </div>

                              {/* Section 3: Details (Conditional Date Picker) */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AnimatePresence>
                                          {foodCategory === 'cooked' && (
                                                <motion.div
                                                      initial={{ opacity: 0, height: 0 }}
                                                      animate={{ opacity: 1, height: 'auto' }}
                                                      exit={{ opacity: 0, height: 0 }}
                                                      className="space-y-3 overflow-hidden"
                                                >
                                                      <label className="text-sm text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                                            <FaClock /> Cooked On
                                                      </label>
                                                      {/* Custom Premium Date Trigger */}
                                                      <div
                                                            onClick={() => dateInputRef.current?.showPicker()}
                                                            className="cursor-pointer group relative glass-input flex items-center gap-3 hover:border-emerald-500/50 transition-colors"
                                                      >
                                                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                                  <FaClock />
                                                            </div>
                                                            <div className="flex-1">
                                                                  <div className="text-xs text-slate-500 uppercase font-bold">Time</div>
                                                                  <div className="text-white font-mono">
                                                                        {formData.cookingTime ? new Date(formData.cookingTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Select Date & Time'}
                                                                  </div>
                                                            </div>
                                                            {/* Hidden Actual Input */}
                                                            <input
                                                                  ref={dateInputRef}
                                                                  type="datetime-local"
                                                                  name="cookingTime"
                                                                  value={formData.cookingTime}
                                                                  onChange={handleChange}
                                                                  max={formatTimeNow()}
                                                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                                                  required={foodCategory === 'cooked'}
                                                                  style={{ visibility: 'hidden', position: 'absolute' }} // Visually hidden but accessible via showPicker
                                                            />
                                                            {/* We need a real visible input for accessibility/fallback if showPicker doesn't work well but for now focusing on style. 
                                                                Actually, standard opacity-0 input on top is safer for interaction.
                                                            */}
                                                            <input
                                                                  type="datetime-local"
                                                                  name="cookingTime"
                                                                  value={formData.cookingTime}
                                                                  onChange={handleChange}
                                                                  max={formatTimeNow()}
                                                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                                  tabIndex={-1}
                                                                  required={foodCategory === 'cooked'}
                                                            />
                                                      </div>
                                                </motion.div>
                                          )}

                                          {foodCategory === 'raw' && (
                                                <motion.div
                                                      initial={{ opacity: 0, height: 0 }}
                                                      animate={{ opacity: 1, height: 'auto' }}
                                                      exit={{ opacity: 0, height: 0 }}
                                                      className="space-y-3 overflow-hidden"
                                                >
                                                      <label className="text-sm text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                                            <FaClock /> Expiry Date
                                                      </label>
                                                      <div
                                                            onClick={() => dateInputRef.current?.showPicker()}
                                                            className="cursor-pointer group relative glass-input flex items-center gap-3 hover:border-emerald-500/50 transition-colors"
                                                      >
                                                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                                                  <FaExclamationCircle />
                                                            </div>
                                                            <div className="flex-1">
                                                                  <div className="text-xs text-slate-500 uppercase font-bold">Use By</div>
                                                                  <div className="text-white font-mono">
                                                                        {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : 'Select Expiry Date'}
                                                                  </div>
                                                            </div>
                                                            <input
                                                                  ref={dateInputRef}
                                                                  type="date"
                                                                  name="expiryDate"
                                                                  value={formData.expiryDate}
                                                                  onChange={handleChange}
                                                                  min={new Date().toISOString().split('T')[0]}
                                                                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                                                  required={foodCategory === 'raw'}
                                                            />
                                                      </div>
                                                </motion.div>
                                          )}
                                    </AnimatePresence>

                                    <div className="space-y-3">
                                          <label className="text-sm text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-2"><FaThermometerHalf /> Storage Condition</label>
                                          <div className="flex bg-black/20 p-1 rounded-lg">
                                                {['Hot', 'Room Temp', 'Refrigerated'].map((type) => (
                                                      <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => handleStorageSelect(type)}
                                                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${formData.storageCondition === type
                                                                  ? 'bg-emerald-500 text-white shadow-lg'
                                                                  : 'text-slate-400 hover:text-white'
                                                                  }`}
                                                      >
                                                            {type}
                                                      </button>
                                                ))}
                                          </div>
                                    </div>
                              </div>

                              <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg uppercase tracking-widest shadow-lg overflow-hidden relative group ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}`}
                              >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                          {status === 'loading' ? 'Verifying Safety...' : 'Confirm Donation'}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                              </motion.button>
                        </form>

                        <AnimatePresence>
                              {status === 'success' && (
                                    <motion.div
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0 }}
                                          className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 text-center"
                                    >
                                          <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                type="spring"
                                                className="text-6xl text-emerald-500 mb-4"
                                          >
                                                <FaCheckCircle />
                                          </motion.div>
                                          <h4 className="text-3xl font-bold text-white mb-2">Thank You!</h4>
                                          <p className="text-slate-300 mb-6">{msg}</p>
                                          <p className="text-emerald-400 font-mono text-sm border border-emerald-500/30 p-2 rounded bg-emerald-500/10">
                                                Impact: ~{Math.floor(parseFloat(formData.quantity || 0) * 4)} potential meals
                                          </p>
                                          <button
                                                onClick={() => setStatus(null)}
                                                className="mt-8 text-slate-400 hover:text-white underline text-sm"
                                          >
                                                Make another donation
                                          </button>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>
            </div>
      );
};

export default DonorSubmission;
