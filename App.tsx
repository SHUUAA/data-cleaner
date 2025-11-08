import React, { useState, useCallback } from "react";
import CountryButton from "./components/CountryButton";
import { countries } from "./constants";

const App: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set()
  );
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleCountryClick = useCallback((countryName: string) => {
    setSelectedCountries((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(countryName)) {
        newSelected.delete(countryName);
      } else {
        newSelected.add(countryName);
      }
      return newSelected;
    });
    setSubmitted(false);
    setSubmissionError(null);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedCountries.size === countries.length) {
      setSelectedCountries(new Set());
    } else {
      setSelectedCountries(new Set(countries));
    }
    setSubmitted(false);
    setSubmissionError(null);
  }, [selectedCountries.size]);

  const handleClearSelections = useCallback(() => {
    setSelectedCountries(new Set());
    setSubmitted(false);
    setSubmissionError(null);
  }, []);

  const handleSubmit = async () => {
    if (selectedCountries.size === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitted(false);
    setSubmissionError(null);

    const webhookUrl =
      "https://primary-production-aa7d9.up.railway.app/webhook/submit";
    const countriesWithRawData = Array.from(selectedCountries).map(
      (country) => `${country} (raw data)`
    );

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ countries: countriesWithRawData }),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      console.log("Submission successful");
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const allSelected = selectedCountries.size === countries.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-neutral-800">
        <header className="text-center mb-8">
          <h1
            className="font-serif text-5xl sm:text-6xl font-bold text-neutral-900 mb-3"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.1)" }}
          >
            Data Cleaner
          </h1>
          <p className="text-lg text-neutral-600/90">
            Select one or more countries below and click submit.
          </p>
        </header>

        <main>
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            <button
              onClick={handleClearSelections}
              disabled={selectedCountries.size === 0}
              className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Selections
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
            {countries.map((country) => (
              <CountryButton
                key={country}
                countryName={country}
                isSelected={selectedCountries.has(country)}
                onClick={() => handleCountryClick(country)}
              />
            ))}
          </div>

          <div className="min-h-[72px] flex flex-col justify-center mb-6">
            {submitted && (
              <div className="p-4 bg-green-400/30 backdrop-blur-md border border-green-500/50 rounded-lg text-green-900 animate-fade-in">
                <p className="font-semibold">Submission Successful!</p>
                <p className="text-sm">
                  Data sent to webhook:{" "}
                  {Array.from(selectedCountries)
                    .map((c) => `${c} (raw data)`)
                    .join(", ")}
                  .
                </p>
              </div>
            )}

            {submissionError && (
              <div className="p-4 bg-red-400/30 backdrop-blur-md border border-red-500/50 rounded-lg text-red-900 animate-fade-in">
                <p className="font-semibold">Submission Failed</p>
                <p className="text-sm">{submissionError}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={selectedCountries.size === 0 || isSubmitting}
              className="w-full sm:w-auto px-12 py-4 text-lg font-bold text-white bg-rose-500 rounded-full shadow-lg shadow-rose-500/30 hover:bg-rose-600 disabled:bg-gray-400/50 disabled:border-gray-500/50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-rose-500/40 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                `Submit (${selectedCountries.size})`
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
