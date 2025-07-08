import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import FundDetails from "./pages/FundDetails";
import SavedFunds from "./pages/SavedFunds";
import Navbar from "./components/Navbar";
import AddFund from "./pages/AddFund";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-fund" element={<AddFund />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fund/:schemeCode" element={<FundDetails />} />{" "}
        {/* ✅ updated route param */}
        <Route path="/saved" element={<SavedFunds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
