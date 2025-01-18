import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/homeSection/home";
// import FormBuilder from "./components/formBuilder/formBuilder";
import FormBuilder from "./components/formBuilder/new file structure/FormBuilder";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/make_form/:id" element={<FormBuilder />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </div>
  );
};

export default App;
