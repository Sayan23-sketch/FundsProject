import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SearchFund.css";
import { useNavigate } from "react-router-dom";

function SearchFund() {
    const [query, setQuery] = useState("");
    const [funds, setFunds] = useState([]);
    const [filteredFunds, setFilteredFunds] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch all funds on mount
    useEffect(() => {
        const fetchFunds = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://api.mfapi.in/mf");
                setFunds(res.data);
                setError("");
            } catch (err) {
                console.error("Error fetching funds", err);
                setError("❗ Could not load mutual funds. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchFunds();
    }, []);

    // Real-time filtering
    useEffect(() => {
        if (query.trim().length < 3) {
            setFilteredFunds([]);
            return;
        }

        const filtered = funds.filter((fund) =>
            fund.schemeName?.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredFunds(filtered.slice(0, 20)); // Limit results
    }, [query, funds]);

    const handleFundClick = (schemeCode) => {
        navigate(`/fund/${schemeCode}`);
    };

    return (
        <div className="search-container">
            <h2>Search Mutual Fund</h2>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="🔍 Start typing (e.g., Axis, SBI)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {error && <p className="error">{error}</p>}
            {loading && <p className="loading">Loading mutual funds...</p>}

            {/* Show filtered results */}
            {!loading && query.length >= 3 && (
                <div className="fund-list">
                    {filteredFunds.length > 0 ? (
                        filteredFunds.map((fund) => (
                            <div
                                key={fund.schemeCode}
                                className="fund-result-row"
                                onClick={() => handleFundClick(fund.schemeCode)}
                            >
                                <h3>{fund.schemeName}</h3>
                                <p>Scheme Code: {fund.schemeCode}</p>
                            </div>
                        ))
                    ) : (
                        <p className="landing-info">❗ No results found for "{query}"</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchFund;
