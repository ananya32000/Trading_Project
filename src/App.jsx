import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./Components/Calendar/Calendar";
import CalendarCell from "./Components/Calendar/CalendarCell";
import { ThemeProvider } from "./Components/ThemeContext";
import './index.css';
import CustomCursor from "./Components/Cursor";
import Particles from "./Components/background";

const App = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Add CustomCursor here */}
      <CustomCursor />
      
      <ThemeProvider>
        <Router>
          {/* Main container with black background */}
          <div className="relative min-h-screen bg-black">
            {/* Particles layer - sits above black bg but below content */}
            <div className="absolute inset-0 z-0 opacity-50">
              <Particles
                particleColors={['#ffffff', '#ffffff']}
                particleCount={200}
                particleSpread={10}
                speed={0.1}
                particleBaseSize={100}
                moveParticlesOnHover={true}
                alphaParticles={false}
                disableRotation={false}
              />
            </div>
            
            {/* Content layer - sits above particles */}
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/CalendarCell" element={<CalendarCell />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;