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

  // Fetch saved fund IDs
  useEffect(() => {
    const fetchSavedFunds = async () => {
      setLoading(true);
      try {
        const res = await API.get("/api/funds/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = res.data.savedFundIds;
        setSavedIds(ids);
      } catch (err) {
        console.error("Failed to fetch saved funds:", err);
        alert("Failed to fetch saved fund list.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSavedFunds();
  }, [token]);

  // Fetch fund details (MFAPI + custom)
  useEffect(() => {
    const fetchFundDetails = async () => {
      const mfapiIds = savedIds.filter((id) => /^\d+$/.test(id));
      const customIds = savedIds.filter((id) => !/^\d+$/.test(id));

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
    } else {
      setFunds([]);
      setCustomFunds([]);
    }
  }, [savedIds, token]);

  // Function to save a fund
  const saveFund = async (fund) => {
    if (savedIds.includes(fund.schemeCode)) {
      alert("This fund is already saved.");
      return;
    }

    try {
      await API.post("/api/funds/save", { fundId: fund.schemeCode }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Fund saved successfully!");
      setSavedIds((prev) => [...prev, fund.schemeCode]); // Update savedIds state
    } catch (err) {
      console.error("Error saving fund:", err);
      alert("Failed to save fund.");
    }
  };

  return (
    <div className="saved-container">
      <h2 className="saved-title">Your Saved Mutual Funds</h2>

      {loading ? (
        <p className="saved-message">⏳ Loading saved funds...</p>
      ) : funds.length === 0 && customFunds.length === 0 ? (
        <p className="saved-message">📭 You haven't saved any funds yet.</p>
      ) : (
        <div className="saved-list">
          {[...funds, ...customFunds].map((fund) => (
            <FundCard
              key={fund.schemeCode}
              fund={fund}
              showSaveButton={true} // Show save button
              onSave={() => saveFund(fund)} // Pass save function
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedFunds;

