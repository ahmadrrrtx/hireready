import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import SkillsPage from './pages/SkillsPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0f]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
