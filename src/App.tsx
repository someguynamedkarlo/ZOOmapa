import { useState, useEffect, useRef } from "react";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";
import { popisUsluga } from "./Usluge";
import "./CSS/App.css";
import ScrollableMenu from "./ScrollableMenu";

const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";
const filterMapping = {
  Besplatno: 0,
  "Naplata sukladno cjeniku usluga": 1,
  "Pojedine usluge uz nadoplatu": 2,
};

function App() {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    45.32560918851513, 14.44176433327116,
  ]);
  const [filteredMatches, setFilteredMatches] = useState<Usluga[]>([]);

  interface Usluga {
    imeUstanove: string;
    lat: number;
    lng: number;
    adresa: string;
    telefon: string;
    email: string;
    web: string;
    radnoVrijeme: string;
    preduvjeti: string;
    trosak: number;
    namjenjeno: string;
    opis: string;
    specUsluga: string;
    pruzatelj: string;
    kategorija: number[]; // Keep as an array of numbers
  }

  const mapRef = useRef<L.Map | null>(null);

  // Fixing the issue with type mapping
  const updateFilteredMatches = () => {
    console.log(
      "Selected Filters inside updateFilteredMatches:",
      selectedFilters
    );

    const filteredData = popisUsluga.filter((location: Usluga) => {
      // Search term filtering (based on "imeUstanove")
      const matchesSearch = searchTerm
        ? location.imeUstanove.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // Filter matches based on selected filters
      const matchesFilters = Object.entries(selectedFilters).every(
        ([category, options]) => {
          // If no options are selected for this category, return true (i.e., no filtering)
          if (options.length === 0) return true;

          const categoryValue = location[category as keyof Usluga];

          // Handle 'Trošak za korisnike' filter
          if (category === "Trošak za korisnike") {
            // Map selected filter options (strings) to numeric values using filterMapping
            const mappedTrosak: number[] = options
              .map(
                (option) => filterMapping[option as keyof typeof filterMapping]
              )
              .filter((value) => typeof value === "number"); // Ensure only valid numbers are mapped

            // Check if the mapped options intersect with the "trosak" value of the location
            return (
              mappedTrosak.length === 0 ||
              mappedTrosak.includes(location.trosak)
            );
          }

          // Handle 'Vrste korisnika' filter (based on "namjenjeno" field)
          if (category === "vrste korisnika") {
            console.log("testing something options are", options);
            return options.some((option) =>
              location.namjenjeno.toLowerCase().includes(option.toLowerCase())
            );
          }

          // Handle filtering based on arrays like "kategorija"
          if (Array.isArray(categoryValue)) {
            return options.some((option) =>
              categoryValue.includes(Number(option))
            );
          }

          // Handle filtering based on string fields (e.g., "imeUstanove", "adresa")
          if (typeof categoryValue === "string") {
            return options.some((option) =>
              categoryValue.toLowerCase().includes(option.toLowerCase())
            );
          }

          return false;
        }
      );

      // Return the final match for both search term and filters
      return matchesSearch && matchesFilters;
    });

    // Update the filtered matches state
    setFilteredMatches(filteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    // To prevent overwriting existing selected filters, merge them with the new filters
    console.log("Handling Filter Change", filters);
    setSelectedFilters((prevFilters) => {
      console.log("Current Selected Filters before update:", prevFilters);
      return {
        ...prevFilters,
        ...filters,
      };
    });
  };

  useEffect(() => {
    updateFilteredMatches();
  }, [searchTerm, selectedFilters]);

  return (
    <div style={{ height: "100%" }}>
      <div className="gore">
        <div style={{ position: "relative", display: "inline-block" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            style={{
              position: "absolute",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              fill: "#fff",
            }}
          >
            <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d="M21 21l-6-6M9 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
            />
          </svg>
          <input
            type="text"
            id="searchbar"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ paddingRight: "20px" }}
            placeholder="Search..."
          />
        </div>
        <DropdownWithCheckboxes onFilterChange={handleFilterChange} />
        <ScrollableMenu />
      </div>

      <MapComponent
        mapCenter={mapCenter}
        data={filteredMatches}
        mapRef={mapRef}
        apiKey={apiKey}
      />
    </div>
  );
}

export default App;
