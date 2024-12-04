import { Provider } from 'jotai';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import GameBoard from './components/GameBoard';
import './styles/App.css';

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GameBoard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;