import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import ReportAnimalPage from "./pages/ReportAnimalPage";
import VetRegistrationPage from "./pages/VetRegistrationPage";
import ReportedAnimalsPage from "./pages/ReportedAnimalsPage";
import RecommendedMedicinePage from "./pages/RecommendedMedicinePage";
import VetLoginFrame from "./pages/VetLoginFrame";

function App() {
  return (
    <Router>
      <nav className="bg-blue-600 p-4 text-white flex items-center justify-between">
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/report">Report Animal</Link>
          <Link to="/reported">Reported Animals</Link>
          <Link to="/medicines">Recommended Medicines</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/vets">Vet Registration</Link>
          <Link to="/vet-login">Vet Login</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportAnimalPage />} />
        <Route path="/vets" element={<VetRegistrationPage />} />
        <Route path="/reported" element={<ReportedAnimalsPage />} />
        <Route path="/medicines" element={<RecommendedMedicinePage />} />
        <Route path="/vet-login" element={<VetLoginFrame />} />
      </Routes>
    </Router>
  );
}
export default App;
