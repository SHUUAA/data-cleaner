export const regions = [
  {
    name: "Africa",
    countries: [
      "Ivory Coast",
      "Nigeria",
      "South Africa",
      "Ghana",
      "Congo",
      "Madagascar",
      "Benin",
      "Uganda",
      "Kenya",
      "Democratic Congo",
    ],
  },
  {
    name: "Asia",
    countries: ["Philippines"],
  },
  {
    name: "Pacific Islands",
    countries: ["Tonga", "Fiji"],
  },
];

export const countries: string[] = regions.flatMap(
  (region) => region.countries
);
