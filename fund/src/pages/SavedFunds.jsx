import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/SavedFunds.css";
import FundCard from "../components/FundCard";

function SavedFunds() {
  const [savedIds, setSavedIds] = useState([]);
  const [funds, setFunds] = useState([]);
  const [customFunds, setCustomFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSavedFunds = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/funds/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedIds(res.data.savedFundIds || []);
      } catch (err) {
        console.error("Failed to fetch saved funds:", err);
        alert("Failed to fetch saved fund list.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFunds();
  }, [token]);

  useEffect(() => {
    const fetchFundDetails = async () => {
      const mfapiIds = savedIds.filter((id) => /^\d+$/.test(id)); // numeric IDs only
      const customIds = savedIds.filter((id) => !/^\d+$/.test(id)); // MongoDB _id

      // 🔹 Fetch from MFAPI (use fetch, not axios/API, to avoid sending Authorization header)
      const apiPromises = mfapiIds.map((id) =>
        fetch(`https://api.mfapi.in/mf/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.meta) {
              return {
                schemeName: data.meta.scheme_name,
                fundHouse: data.meta.fund_house,
                schemeCode: id,
                isCustom: false,
              };
            }
            return null;
          })
          .catch((err) => {
            console.error("MFAPI fetch error:", err);
            return null;
          })
      );

      // 🔹 Fetch from backend for custom funds
      const fetchCustomFunds = async () => {
        try {
          const res = await API.get("/api/funds/custom", {
            headers: { Authorization: `Bearer ${token}` },
          });

          return res.data
            .filter((fund) => customIds.includes(fund._id))
            .map((fund) => ({
              schemeName: fund.name,
              fundHouse: fund.fundHouse,
              schemeCode: fund._id,
              isCustom: true,
            }));
        } catch (err) {
          console.error("Custom fund fetch error:", err);
          return [];
        }
      };

      try {
        const [mfapiResults, customResults] = await Promise.all([
          Promise.all(apiPromises),
          fetchCustomFunds(),
        ]);

        setFunds(mfapiResults.filter(Boolean));
        setCustomFunds(customResults);
      } catch (err) {
        console.error("Error loading saved fund data:", err);
        alert("Error loading fund data.");
      }
    };

    if (savedIds.length > 0) {
      fetchFundDetails();
    }
  }, [savedIds, token]);

  return (
    <div className="saved-container">
      <h2 className="saved-title">Your Saved Mutual Funds</h2>

      {loading ? (
        <p className="saved-message"> Loading saved funds...</p>
      ) : funds.length === 0 && customFunds.length === 0 ? (
        <p className="saved-message"> You haven't saved any funds yet.</p>
      ) : (
        <div className="saved-list">
          {[...funds, ...customFunds].map((fund) => (
            <FundCard
              key={fund.schemeCode}
              fund={fund}
              showSaveButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedFunds;
