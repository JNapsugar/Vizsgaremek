import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Belepes from './Belepes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/belepes" element={<Belepes />} />
      </Routes>
    </Router>
  );
}

export default App;
