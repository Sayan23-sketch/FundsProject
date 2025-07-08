import { useState } from "react";
import API from "../services/api";
import "../styles/AddFund.css";

function AddFund() {
  const [form, setForm] = useState({
    name: "",
    nav: "",
    date: "",
    fundHouse: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Add custom fund
      const res = await API.post("/api/funds/custom", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newCustomFundId = res.data.fundId; // <-- returned _id from backend

      // Step 2: Save it to saved fund list
      await API.post(
        "/api/funds/save",
        { fundId: newCustomFundId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Custom fund added and saved!");
      setForm({ name: "", nav: "", date: "", fundHouse: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add and save custom fund.");
    }
  };

  return (
    <div className="add-fund-container">
      <h2>Add Custom Fund</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Fund Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="fundHouse"
          placeholder="Fund House"
          value={form.fundHouse}
          onChange={handleChange}
          required
        />
        <input
          name="nav"
          type="number"
          placeholder="NAV"
          value={form.nav}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Fund</button>
      </form>
    </div>
  );
}

export default AddFund;
