import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";

function App() {
  return (
    <Router>
      <div className="container">
        <ThemeProvider>
          <div className="container">
            <Navbar />
          </div>

          <div className="admin-container">
            <Sidebar />
            <div className="content-area">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                {/* <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} /> */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
