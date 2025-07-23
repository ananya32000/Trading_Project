import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./Components/Calendar/Calendar";
import CalendarCell from "./Components/Calendar/CalendarCell";
import { ThemeProvider } from "./Components/ThemeContext";
import './index.css';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        {/* Full screen dark background */}
        <div className=" bg-black flex items-center justify-center p-6">
          {/* Calendar container with white background */}
            <Routes>
              <Route path="/" element={<Calendar />} />
              <Route path="/CalendarCell" element={<CalendarCell />} />
            </Routes>
        
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
