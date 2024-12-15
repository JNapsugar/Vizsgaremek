import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Ingatlanok from './Ingatlanok';
import Belepes from './Belepes';
import Regisztracio from './Regisztracio';
import ElfelejtettJelszo from './ElfelejtettJelszo';
import Profil from './Profil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ingatlanok" element={<Ingatlanok />} />
        <Route path="/belepes" element={<Belepes />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/elfelejtettjelszo" element={<ElfelejtettJelszo />} />
        <Route path = "/profil" element = {<Profil/>}/>
      </Routes>
    </Router>
  );
}

export default App;
