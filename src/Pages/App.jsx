import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Ingatlanok from './Ingatlanok';
import Reszletek from './Reszletek';
import Belepes from './Belepes';
import Regisztracio from './Regisztracio';
import ElfelejtettJelszo from './ElfelejtettJelszo';
import Profil from './Profil';
import Kiadas from './Kiadas';
import ProfileEdit from './ProfileEdit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ingatlanok" element={<Ingatlanok />} />
        <Route path="/ingatlanok/:ingatlanId" element={<Reszletek />} />
        <Route path="/belepes" element={<Belepes />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/elfelejtettjelszo" element={<ElfelejtettJelszo />} />
        <Route path = "/profil" element = {<Profil/>}/>
        <Route path="/kiadas" element={<Kiadas />} />
        <Route path="/profil-modositas" element={<ProfileEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
