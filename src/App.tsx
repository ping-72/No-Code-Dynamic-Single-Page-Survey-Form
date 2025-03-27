import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./components/homeSection/home";
import ManageResponses from "./manage_responses/ManageResponses";

// import FormBuilder from "./components/formBuilder/formBuilder";
import FormBuilder from "./components/formBuilder/new file structure/FormBuilder";
import FrontendDisplay from "./components/UI_display/frontendDisplay";
import Dashboard from "./Dashboard/main/Dashboard";
import SignIn from "./authentication/pages/SignIn";
import SignUp from "./authentication/pages/SignUp";
import PrivateRoute from "./authentication/PrivateRoutes";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        {/* Open Routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* This is for collecting the response of the form */}
        <Route path="/:userId/:id/sub" element={<FrontendDisplay />} />

        {/* Private Routes */}

        {/* This is for home page */}
        <Route
          path="/:userId/dashboard/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* This is for building the form */}
        <Route
          path="/:userId/:id/edit"
          element={
            <PrivateRoute>
              <FormBuilder />
            </PrivateRoute>
          }
        />
        {/* This is for showing the responses of the form */}
        <Route
          path="/:userId/:formId/responses"
          element={
            <PrivateRoute>
              <ManageResponses />
            </PrivateRoute>
          }
        />
        {/* Default Route*/}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
