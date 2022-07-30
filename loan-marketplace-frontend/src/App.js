import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import ProposeLoan from "./pages/ProposeLoan/ProposeLoan";
import BrowseLoans from "./pages/BrowseLoans/BrowseLoans";
import Profile from "./pages/profile/Profile";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="propose-loan" element={<ProposeLoan />} />
        <Route path="browse-loans" element={<BrowseLoans />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
