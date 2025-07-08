import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import API from "../services/api";
import "../styles/FundDetails.css";

function FundDetails() {
  const { schemeCode } = useParams(); // e.g., 118550
  const [searchParams] = useSearchParams();
  const isCustom = searchParams.get("custom") === "true";

  const [fund, setFund] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch fund data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isCustom) {
          const token = localStorage.getItem("token");
          const res = await API.get("/api/funds/custom", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const found = res.data.find((f) => f._id === schemeCode);
          if (!found) {
            setError("Custom fund not found.");
          } else {
            setFund(found);
          }
        } else {
          const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
          const data = await res.json();
          if (data.meta) {
            setFund(data.meta);
          } else {
            setError("Invalid scheme code.");
          }
        }
      } catch (err) {
        console.error("Error fetching fund:", err);
        setError("Failed to load fund details.");
      }
    };

    fetchData();
  }, [schemeCode, isCustom]);

  // Handle Save
  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to save funds.");
      return;
    }

    if (!schemeCode) {
      alert("Invalid scheme code. Cannot save.");
      return;
    }

    try {
      setSaving(true);

      console.log("🔍 Saving fund ID:", schemeCode);
      console.log("🔐 Token:", token);

      const response = await API.post(
        "/api/funds/save",
        { fundId: schemeCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Save response:", response.data);
      setSaved(true);
      alert("✅ Fund saved successfully.");
    } catch (err) {
      console.error("❌ Save error:", err);

      if (err.response && err.response.data) {
        alert(
          "⚠️ Could not save this fund: " +
            (typeof err.response.data === "string"
              ? err.response.data
              : err.response.data.msg || JSON.stringify(err.response.data))
        );
      } else {
        alert("❌ Could not save this fund.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="fund-details-container">
        <p className="fund-details-error">{error}</p>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="fund-details-container">
        <p className="fund-details-message">⏳ Loading fund details...</p>
      </div>
    );
  }

  return (
    <div className="fund-details-container">
      <div className="fund-details-box">
        <h2 className="fund-details-title">{fund.scheme_name || fund.name}</h2>

        {fund.fund_house || fund.fundHouse ? (
          <p className="fund-details-meta">
            <strong>Fund House:</strong> {fund.fund_house || fund.fundHouse}
          </p>
        ) : null}

        {fund.scheme_type && (
          <p className="fund-details-meta">
            <strong>Scheme Type:</strong> {fund.scheme_type}
          </p>
        )}

        {fund.scheme_category && (
          <p className="fund-details-meta">
            <strong>Category:</strong> {fund.scheme_category}
          </p>
        )}

        {fund.nav && (
          <p className="fund-details-nav">
            <strong>NAV:</strong> ₹{fund.nav}
          </p>
        )}

        {fund.date && (
          <p className="fund-details-meta">
            <strong>Date:</strong> {fund.date}
          </p>
        )}

        {/* Save Button */}
        {!isCustom && (
          <button
            onClick={handleSave}
            className="fund-details-save"
            disabled={saving || saved}
          >
            {saved ? "✔️ Saved" : saving ? "Saving..." : "💾 Save this Fund"}
          </button>
        )}

        {/* Back Link */}
        <Link to={isCustom ? "/saved" : "/"}>
          <button className="fund-details-button">
            ← Back to {isCustom ? "Saved Funds" : "Home"}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default FundDetails;
