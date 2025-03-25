import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import { useEffect } from 'react';
import Home from './Pages/Home';
import Ingatlanok from './Pages/Ingatlanok';
import Reszletek from './Pages/Reszletek';
import Belepes from './Pages/Belepes';
import Regisztracio from './Pages/Regisztracio';
import ElfelejtettJelszo from './Pages/ElfelejtettJelszo';
import Profil from './Pages/Profil';
import Kiadas from './Pages/Kiadas';
import IngatlanKezeles from './Pages/IngatlanKezeles';
import Rolunk from './Pages/Rolunk';

function AnimatedRoutes() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}> 
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ingatlanok" element={<Ingatlanok />} />
        <Route path="/ingatlanok/:ingatlanId" element={<Reszletek />} />
        <Route path="/belepes" element={<Belepes />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/elfelejtettjelszo" element={<ElfelejtettJelszo />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/kiadas" element={<Kiadas />} />
        <Route path="/ingatlanKezeles/:id" element={<IngatlanKezeles />} />
        <Route path="/rolunk" element={<Rolunk />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;