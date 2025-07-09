import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FundDetails from "./pages/FundDetails";
import SavedFunds from "./pages/SavedFunds";
import Navbar from "./components/Navbar";
import AddFund from "./pages/AddFund";
import SearchFund from "./pages/SearchFund"; 
import FundDetailsPage from "./pages/FundDetailsPage";// ✅ New import

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-fund" element={<AddFund />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fund/:schemeCode" element={<FundDetails />} />
        
        <Route path="/fund-details" element={<FundDetailsPage />} />
        <Route path="/saved" element={<SavedFunds />} />
        <Route path="/search" element={<SearchFund />} /> {/* ✅ New search page route */}
        <Route
          path="*"
          element={<h2 style={{ padding: "2rem" }}>404 - Page Not Found</h2>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
