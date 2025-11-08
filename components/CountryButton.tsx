import React from "react";

interface CountryButtonProps {
  countryName: string;
  isSelected: boolean;
  onClick: () => void;
}

const CountryButton: React.FC<CountryButtonProps> = ({
  countryName,
  isSelected,
  onClick,
}) => {
  const baseClasses =
    "w-full h-full px-2 py-4 text-center text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-rose-500/70";

  const selectedClasses = "bg-rose-500 text-white scale-105 shadow-rose-500/40";

  const unselectedClasses =
    "bg-white/30 backdrop-blur-md border border-white/40 text-neutral-700 hover:bg-white/50 hover:text-neutral-900 hover:scale-105";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${
        isSelected ? selectedClasses : unselectedClasses
      }`}
      aria-pressed={isSelected}
    >
      {countryName}
    </button>
  );
};

export default CountryButton;
