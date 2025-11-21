import React, { useState, useCallback } from "react";
import CountryButton from "./components/CountryButton";
import { countries, regions } from "./constants";

type Tab = "enrollment" | "assessment";

const App: React.FC = () => {
  // Common state
  const [activeTab, setActiveTab] = useState<Tab>("enrollment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Enrollment state
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(
    new Set()
  );

  // Assessment state
  const assessments = Array.from(
    { length: 10 },
    (_, i) => `General Assessment ${i + 1}`
  );
  const [selectedAssessments, setSelectedAssessments] = useState<Set<string>>(
    new Set()
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSubmissionResult(null);
  };

  // --- Enrollment Handlers ---
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
    setSubmissionResult(null);
  }, []);

  const handleSelectAllCountries = useCallback(() => {
    if (selectedCountries.size === countries.length) {
      setSelectedCountries(new Set());
    } else {
      setSelectedCountries(new Set(countries));
    }
    setSubmissionResult(null);
  }, [selectedCountries.size]);

  const handleClearCountrySelections = useCallback(() => {
    setSelectedCountries(new Set());
    setSubmissionResult(null);
  }, []);

  // --- Assessment Handlers ---
  const handleAssessmentClick = useCallback((assessmentName: string) => {
    setSelectedAssessments((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(assessmentName)) {
        newSelected.delete(assessmentName);
      } else {
        newSelected.add(assessmentName);
      }
      return newSelected;
    });
    setSubmissionResult(null);
  }, []);

  const handleSelectAllAssessments = useCallback(() => {
    if (selectedAssessments.size === assessments.length) {
      setSelectedAssessments(new Set());
    } else {
      setSelectedAssessments(new Set(assessments));
    }
    setSubmissionResult(null);
  }, [selectedAssessments.size, assessments]);

  const handleClearAssessmentSelections = useCallback(() => {
    setSelectedAssessments(new Set());
    setSubmissionResult(null);
  }, []);

  // --- Submission Handler ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    let webhookUrl = "";
    let payload: object;
    let dataForSuccessMessage = "";

    if (activeTab === "enrollment") {
      if (selectedCountries.size === 0) {
        setIsSubmitting(false);
        return;
      }
      webhookUrl = "https://1566-784.n8nbysnbd.top/webhook/submit";

      // "https://primary-production-aa7d9.up.railway.app/webhook/submit";
      // "https://seal-neutral-nationally.ngrok-free.app/webhook/submit"
      const countriesWithRawData = Array.from(selectedCountries).map(
        (country) => `${country} (raw data)`
      );
      payload = { countries: countriesWithRawData };
      dataForSuccessMessage = countriesWithRawData.join(", ");
    } else {
      // activeTab === 'assessment'
      if (selectedAssessments.size === 0) {
        setIsSubmitting(false);
        return;
      }
      webhookUrl = "https://1566-784.n8nbysnbd.top/webhook/assessment";

      // "https://primary-production-aa7d9.up.railway.app/webhook/assessment";
      // "https://seal-neutral-nationally.ngrok-free.app/webhook/assessment";
      const assessmentsData = Array.from(selectedAssessments);
      payload = { assessments: assessmentsData };
      dataForSuccessMessage = assessmentsData.join(", ");
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      console.log("Submission successful");
      setSubmissionResult({
        success: true,
        message: `Data sent to webhook: ${dataForSuccessMessage}.`,
      });
    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again.";
      setSubmissionResult({ success: false, message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allCountriesSelected = selectedCountries.size === countries.length;
  const allAssessmentsSelected =
    selectedAssessments.size === assessments.length;

  const selectionSize =
    activeTab === "enrollment"
      ? selectedCountries.size
      : selectedAssessments.size;
  const isSubmitDisabled = selectionSize === 0 || isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 lg:py-20 font-sans antialiased">
      <div className="w-full max-w-4xl bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 text-neutral-800">
        <header className="text-center mb-8">
          <h1
            className="font-serif text-5xl sm:text-6xl font-bold text-neutral-900 mb-3"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.1)" }}
          >
            Data Cleaner
          </h1>
          <p className="text-lg text-neutral-600/90">
            {activeTab === "enrollment"
              ? "Select one or more countries below and click submit."
              : "Select one or more assessments below and click submit."}
          </p>
        </header>

        <main>
          <div className="flex border-b border-gray-200/50 mb-6">
            <button
              onClick={() => handleTabChange("enrollment")}
              className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 focus:outline-none ${
                activeTab === "enrollment"
                  ? "text-rose-500 border-b-2 border-rose-500"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Enrollment
            </button>
            <button
              onClick={() => handleTabChange("assessment")}
              className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 focus:outline-none ${
                activeTab === "assessment"
                  ? "text-rose-500 border-b-2 border-rose-500"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              General Assessment
            </button>
          </div>

          {activeTab === "enrollment" && (
            <div className="animate-fade-in">
              <div className="flex justify-end mb-4 space-x-2">
                <button
                  onClick={handleSelectAllCountries}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors"
                >
                  {allCountriesSelected ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={handleClearCountrySelections}
                  disabled={selectedCountries.size === 0}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Selections
                </button>
              </div>

              <div className="space-y-8 mb-10">
                {regions.map((region) => (
                  <div key={region.name}>
                    <h2 className="text-xl font-bold text-neutral-800 mb-4 border-b-2 border-rose-200 pb-2">
                      {region.name}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {region.countries.map((country) => (
                        <CountryButton
                          key={country}
                          countryName={country}
                          isSelected={selectedCountries.has(country)}
                          onClick={() => handleCountryClick(country)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assessment" && (
            <div className="animate-fade-in">
              <div className="flex justify-end mb-4 space-x-2">
                <button
                  onClick={handleSelectAllAssessments}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors"
                >
                  {allAssessmentsSelected ? "Deselect All" : "Select All"}
                </button>
                <button
                  onClick={handleClearAssessmentSelections}
                  disabled={selectedAssessments.size === 0}
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-black/5 backdrop-blur-md border border-black/10 rounded-lg hover:bg-black/10 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Selections
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10">
                {assessments.map((assessment) => (
                  <CountryButton
                    key={assessment}
                    countryName={assessment}
                    isSelected={selectedAssessments.has(assessment)}
                    onClick={() => handleAssessmentClick(assessment)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="min-h-[72px] flex flex-col justify-center mb-6">
            {submissionResult && submissionResult.success && (
              <div className="p-4 bg-green-400/30 backdrop-blur-md border border-green-500/50 rounded-lg text-green-900 animate-fade-in">
                <p className="font-semibold">Submission Successful!</p>
                <p className="text-sm">{submissionResult.message}</p>
              </div>
            )}

            {submissionResult && !submissionResult.success && (
              <div className="p-4 bg-red-400/30 backdrop-blur-md border border-red-500/50 rounded-lg text-red-900 animate-fade-in">
                <p className="font-semibold">Submission Failed</p>
                <p className="text-sm">{submissionResult.message}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full sm:w-auto px-12 py-4 text-lg font-bold text-white bg-rose-500 rounded-full shadow-lg shadow-rose-500/30 hover:bg-rose-600 disabled:bg-gray-400/50 disabled:border-gray-500/50 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-rose-500/40 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 flex items-center justify-center"
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
                `Submit (${selectionSize})`
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
