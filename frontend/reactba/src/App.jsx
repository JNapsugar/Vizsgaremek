import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Pages/Home';
import Ingatlanok from './Pages/Ingatlanok';
import Reszletek from './Pages/Reszletek';
import Belepes from './Pages/Belepes';
import Regisztracio from './Pages/Regisztracio';
import ElfelejtettJelszo from './Pages/ElfelejtettJelszo';
import Profil from './Pages/Profil';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingatlanok" element={<Ingatlanok />} />
        <Route path="/ingatlanok/:ingatlanId" element={<Reszletek />} />
        <Route path="/belepes" element={<Belepes />} />
        <Route path="/regisztracio" element={<Regisztracio />} />
        <Route path="/elfelejtettjelszo" element={<ElfelejtettJelszo />} />
        <Route path = "/profil" element = {<Profil/>}/>
      </Routes>
    </Router>
  );
}

export default App;
