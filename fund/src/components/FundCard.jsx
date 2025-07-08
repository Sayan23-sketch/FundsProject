import { Link } from "react-router-dom";
import "../styles/FundCard.css";

function FundCard({ fund, onSave, showSaveButton = true }) {
  const fundLink = fund.isCustom
    ? `/fund/${fund.schemeCode}?custom=true`
    : `/fund/${fund.schemeCode}`;

  const handleSaveClick = (e) => {
    e.stopPropagation(); // prevent parent click (if any)
    onSave && onSave(fund);
  };

  return (
    <div className="fund-card">
      <h2 className="fund-title">{fund.schemeName}</h2>

      {fund.fundHouse && (
        <p className="fund-meta">Fund House: {fund.fundHouse}</p>
      )}

      <div className="fund-actions">
        <Link to={fundLink} className="fund-view-button">
          View Details
        </Link>

        {showSaveButton && (
          <button onClick={handleSaveClick} className="fund-save-button">
            Save
          </button>
        )}
      </div>
    </div>
  );
}

export default FundCard;
