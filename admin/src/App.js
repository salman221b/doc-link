import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ThemeProvider } from "./context/ThemeContext";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../src/route";

function App() {
  return (
    <div className="container">
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
