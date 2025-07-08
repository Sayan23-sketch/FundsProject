import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";

function Home() {
  const [query, setQuery] = useState("");
  const [funds, setFunds] = useState([]);
  const [filteredFunds, setFilteredFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://api.mfapi.in/mf");
      setFunds(res.data);
      setError("");
    } catch (err) {
      console.error("API fetch error:", err);
      setError(
        " Failed to fetch funds. Please check your connection or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    setQuery(text);

    if (text.trim().length < 3) {
      setFilteredFunds([]);
      return;
    }

    const filtered = funds.filter((f) =>
      f.schemeName?.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredFunds(filtered.slice(0, 20));
  };

  const handleFundClick = (schemeCode) => {
    window.location.href = `/fund/${schemeCode}`;
  };

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1 className="landing-title">Explore Mutual Funds</h1>

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="🔍 Search by scheme name (e.g., Axis, SBI, HDFC)..."
          className="landing-input"
        />

        {loading && <p className="landing-info"> Loading funds...</p>}
        {error && <p className="landing-error">{error}</p>}
        {!loading &&
          !error &&
          query.length >= 3 &&
          filteredFunds.length === 0 && (
            <p className="landing-info">❗ No results found for "{query}".</p>
          )}

        {/*  Vertical Search Results */}
        <div className="fund-list">
          {filteredFunds.map((fund) => (
            <div
              key={fund.schemeCode}
              className="fund-result-row"
              onClick={() => handleFundClick(fund.schemeCode)}
            >
              <h3>{fund.schemeName}</h3>
              <p>Scheme Code: {fund.schemeCode}</p>
            </div>
          ))}
        </div>

        {/* Info Section Always Visible */}
        <div className="fund-info">
          <h2>What Are Mutual Funds?</h2>
          <p>
            Mutual funds are professionally managed investment pools that allow
            individuals to invest in a diversified portfolio of assets such as
            stocks, bonds, or other securities.
          </p>
          <p>
            They are a convenient and low-risk way for new investors to enter
            the market. Use the search bar above to explore different mutual
            funds and click on a result to view more details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
