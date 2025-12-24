import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FaArrowRight } from 'react-icons/fa';

const LandingPage = () => {
      const heroRef = useRef(null);
      const textRef = useRef(null);

      useEffect(() => {
            const tl = gsap.timeline();

            tl.fromTo(heroRef.current,
                  { opacity: 0, scale: 0.9 },
                  { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
            )
                  .fromTo(textRef.current.children,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" },
                        "-=1"
                  );
      }, []);

      return (
            <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-black text-white">
                  {/* Background Video/Image Placeholder */}
                  <div className="absolute inset-0 z-0">
                        <img
                              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop"
                              alt="Background"
                              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  </div>

                  {/* Glowing Orbs for Vibe */}
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] animate-pulse delay-1000"></div>

                  {/* Main Content */}
                  <div ref={heroRef} className="relative z-10 text-center max-w-5xl px-6">
                        <div ref={textRef} className="space-y-6">
                              <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-400 font-mono text-sm tracking-widest uppercase mb-4"
                              >
                                    Annadata+ Hackathon Prototype
                              </motion.div>

                              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight">
                                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 pb-2">
                                          Bridging Surplus
                                    </span>
                                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 pb-2">
                                          To Scarcity.
                                    </span>
                              </h1>

                              <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                                    A real-time food redistribution network powered by geolocation and hunger mapping data.
                              </p>

                              <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
                                    <Link to="/donate">
                                          <motion.button
                                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                                                whileTap={{ scale: 0.95 }}
                                                className="group relative px-8 py-4 bg-emerald-500 text-black font-bold text-lg rounded-full flex items-center gap-3 overflow-hidden"
                                          >
                                                <span className="relative z-10">Launch Prototype</span>
                                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                          </motion.button>
                                    </Link>

                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono">
                                          View Source Code
                                    </a>
                              </div>
                        </div>
                  </div>

                  {/* Footer / Credits */}
                  <div className="absolute bottom-8 w-full text-center text-slate-600 text-xs font-mono uppercase tracking-widest">
                        Designed for Impact • SDG-2 Zero Hunger
                  </div>
            </div>
      );
};

export default LandingPage;
