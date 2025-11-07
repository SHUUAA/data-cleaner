import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleClick = (country) => {
    setSelectedCountries((prev) => {
      if (prev.includes(country)) {
        return prev.filter((c) => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedCountries.length === 0) {
      alert("Please select at least one country");
      return;
    }
    console.log("Selected countries:", selectedCountries);
    // Add your submission logic here
  };

  const countries = [
    "Ivory Coast",
    "Philippines",
    "Nigeria",
    "South Africa",
    "Ghana",
    "Congo",
    "Madagascar",
    "Benin",
    "Uganda",
    "Kenya",
    "Democratic Congo",
  ];

  return (
    <div className="container">
      <h1>Raw Data Selection</h1>
      <div className="selection-info">
        {selectedCountries.length > 0 ? (
          <p>Selected: {selectedCountries.length} countries</p>
        ) : (
          <p>Select one or more countries</p>
        )}
      </div>
      <div className="button-grid">
        {countries.map((country) => (
          <button
            key={country}
            className={`country-button ${
              selectedCountries.includes(country) ? "selected" : ""
            }`}
            onClick={() => handleClick(country)}
          >
            {country} (raw data)
          </button>
        ))}
      </div>
      <div className="submit-container">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={selectedCountries.length === 0}
        >
          Submit Selection
        </button>
      </div>
    </div>
  );
};

export default App;
