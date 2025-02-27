import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/homeSection/home";
// import FormBuilder from "./components/formBuilder/formBuilder";
import FormBuilder from "./components/formBuilder/new file structure/FormBuilder";
import FrontendDisplay from "./components/UI_display/frontendDisplay";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        {/* This is for home page */}
        <Route path="/dashboard" element={<Home />} />
        {/* This is for building the form */}
        <Route path="/:userId/:id/edit" element={<FormBuilder />} />
        {/* This is for collecting the response of the form */}
        <Route path="/:userId/:id/sub" element={<FrontendDisplay />} />
        {/* This is for showing the responses of the form */}
        <Route path="/:userId/:id/resp" element={<h1>Responses shown</h1>} />
        {/* This is for dashboard, to be implemented later */}
        <Route path="/" element={<h1>Dashboard</h1>} />
      </Routes>
    </div>
  );
};

export default App;
