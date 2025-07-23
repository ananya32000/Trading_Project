import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendar from "./Components/Calendar/Calendar";
import CalendarCell from "./Components/Calendar/CalendarCell";
import { ThemeProvider } from "./Components/ThemeContext";
import { ThemeContext } from "./Components/ThemeContext";
import './index.css';


const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/CalendarCell" element={<CalendarCell />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
