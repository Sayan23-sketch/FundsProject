// src/pages/FundDetailsPage.jsx
import "../styles/FundDetailsPage.css";
import { useEffect, useState } from "react";
import API from "../services/api";

function FundDetailsPage() {
    const [fundDetails, setFundDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedFundDetails = async () => {
            try {
                const token = localStorage.getItem("token");

                // Step 1: Get saved fund IDs
                const res = await API.get("/api/funds/saved", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { savedFundIds } = res.data;

                // Step 2: Fetch details for each saved fund
                const promises = savedFundIds.map((id) =>
                    API.get(`/api/funds/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((res) => res.data)
                );

                const details = await Promise.all(promises);
                setFundDetails(details);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching full fund details:", err);
                setLoading(false);
            }
        };

        fetchSavedFundDetails();
    }, []);

    if (loading) return <div className="fund-details-page"><h2>Loading fund details...</h2></div>;

    return (
        <div className="fund-details-page">
            <h2>Your Saved Fund Details</h2>
            {fundDetails.length === 0 ? (
                <p style={{ color: "#f1f5f9" }}>No saved funds yet.</p>
            ) : (
                fundDetails.map((fund, index) => (
                    <div className="fund-card" key={index}>
                        <h3>{fund.meta?.scheme_name}</h3>
                        <p><strong>Fund House:</strong> {fund.meta?.fund_house}</p>
                        <p><strong>Scheme Type:</strong> {fund.meta?.scheme_type}</p>
                        <p><strong>Scheme Category:</strong> {fund.meta?.scheme_category}</p>
                        <p><strong>NAV:</strong> ₹{fund.data?.[0]?.nav}</p>
                        <p><strong>Date:</strong> {fund.data?.[0]?.date}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default FundDetailsPage;
