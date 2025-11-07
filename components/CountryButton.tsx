
import React from 'react';

interface CountryButtonProps {
  countryName: string;
  isSelected: boolean;
  onClick: () => void;
}

const CountryButton: React.FC<CountryButtonProps> = ({ countryName, isSelected, onClick }) => {
  const baseClasses = "w-full h-full px-3 py-4 text-center font-semibold rounded-lg shadow-md border-2 transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-4";
  
  const selectedClasses = "bg-blue-500 border-blue-600 text-white hover:bg-blue-600 scale-105 shadow-blue-500/50 focus:ring-blue-300 dark:focus:ring-blue-800";
  
  const unselectedClasses = "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-105 focus:ring-blue-300 dark:focus:ring-blue-800";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      aria-pressed={isSelected}
    >
      {countryName}
    </button>
  );
};

export default CountryButton;
