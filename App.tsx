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
    setSubmitted(false); // Reset submitted state on new selection
    setSubmissionError(null); // Also reset error state
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
      "https://primary-production-aa7d9.up.railway.app/webhook-test/submit";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-500">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400 mb-2">
            Country Selector
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select one or more countries below and click submit.
          </p>
        </header>

        <main>
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              {allSelected ? "Deselect All" : "Select All"}
            </button>
            <button
              onClick={handleClearSelections}
              disabled={selectedCountries.size === 0}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="p-4 bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 rounded-lg text-green-800 dark:text-green-200 animate-fade-in">
                <p className="font-semibold">Submission Successful!</p>
                <p>
                  Data sent to webhook:{" "}
                  {Array.from(selectedCountries)
                    .map((c) => `${c} (raw data)`)
                    .join(", ")}
                  .
                </p>
              </div>
            )}

            {submissionError && (
              <div className="p-4 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 rounded-lg text-red-800 dark:text-red-200 animate-fade-in">
                <p className="font-semibold">Submission Failed</p>
                <p>{submissionError}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={selectedCountries.size === 0 || isSubmitting}
              className="w-full sm:w-auto px-12 py-4 text-lg font-bold text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
