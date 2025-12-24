import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import DonorSubmission from './pages/DonorSubmission';
import HungerMap from './pages/HungerMap';
import NGODashboard from './pages/NGODashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import LandingPage from './pages/LandingPage';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-emerald-500 selection:text-white">
      {location.pathname !== '/' && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/donate" element={<DonorSubmission />} />
          <Route path="/map" element={<HungerMap />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/impact" element={<ImpactDashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
