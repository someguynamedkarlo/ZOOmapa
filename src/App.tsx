import { useState, useEffect, useRef } from "react";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";
import { popisUsluga } from "./Usluge";
import "./CSS/App.css";
import ScrollableMenu from "./ScrollableMenu";

const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";

const filterMappingCost = {
  Besplatno: 0,
  "Naplata sukladno cjeniku usluga": 1,
  "Pojedine usluge uz nadoplatu": 2,
};

const filterMappingTime = {
  "Ponedjeljak - Petak": 0,
  Subota: 1,
  "Rad nedjeljom": 2,
};
const lokacijeMapping = {
  "zdravstveno osiguranje": 1,
  "USLUGE (SPECIFIČNO) ZA MLADE": 2,
  "USLUGE (SPECIFIČNO) ZA DJECU": 3,
  "PREVENCIJA - PROMICANJE ZDRAVLJA I SUZBIJANJE BOLESTI": 4,
  "ZDRAVSTVENI ODGOJ I OBRAZOVANJE": 5,
  "OBITELJSKA MEDICINA / OPĆA PRAKSA": 6,
  "HITNA MEDICINSKA POMOĆ": 7,
  BOLNICE: 8,
  "PSIHIJATRIJSKO LIJEČENJE": 9,
  "PSIHOLOŠKO SAVJETOVANJE/POMOĆ": 10,
  "OSTALE SPECIJALIZIRANE USLUGE SAVJETOVANJA": 11,
  "PODRŠKA OVISNICIMA": 12,
  "ZDRAVLJE ŽENA I REPRODUKTIVNO ZDRAVLJE": 13,
  "PODRŠKA OBOLJELIMA I REHABILITACIJA": 14,
  STOMATOLOZI: 15,
  "LJEKARNE S DEŽURSTVIMA": 16,
  "LJEKARNE BEZ DEŽURSTAVA": 17,
  VETERINARI: 18,
  "PRIVATNE BOLNICE I POLIKLINIKE": 19,
  "OSTALE USLUGE - NEKATEGORIZIRANO": 20,
};

function App() {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter] = useState<[number, number]>([
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
    kategorija: number[];
  }
  const handleButtonClick = (categoryLabel: string) => {
    // Find the correct mapped value for the label
    const mappedCategory = Object.entries(lokacijeMapping).find(
      ([key]) => key.trim().toLowerCase() === categoryLabel.trim().toLowerCase()
    )?.[1];

    if (mappedCategory) {
      setSelectedFilters({
        Lokacije: [categoryLabel], // Update Lokacije filter with the clicked category
      });
    } else {
      console.error(`Category "${categoryLabel}" not found in mapping.`);
    }
  };

  const mapRef = useRef<L.Map | null>(null);

  // Function to check if the service matches the selected filters
  const spadaLiUFilter = (
    usluga: Usluga,
    filters: { [key: string]: string[] }
  ) => {
    const matchesSearch = searchTerm
      ? usluga.imeUstanove.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesFilters = Object.entries(filters).every(
      ([category, options]) => {
        if (options.length === 0) return true; // No filter selected for this category, allow all items

        const categoryValue = usluga[category as keyof Usluga];

        // Handle filtering for "Vrste korisnika" filter
        if (category === "Trošak za korisnike") {
          const mappedTrosak: number[] = options
            .map(
              (option) =>
                filterMappingCost[option as keyof typeof filterMappingCost]
            )
            .filter((value) => typeof value === "number"); // Ensure only valid numbers are mapped

          // Log the selected options and mapped values
          console.log("Selected Trošak options:", options);
          console.log("Mapped Trošak values:", mappedTrosak);
          console.log("Service 'trosak' value:", usluga.trosak);

          // Check if the mapped options intersect with the "trosak" value of the location
          return (
            mappedTrosak.length === 0 || mappedTrosak.includes(usluga.trosak)
          );
        }
        if (category === "Vrsta korisnika") {
          console.log("Checking Vrste korisnika filter options:", options);
          console.log("Service 'namjenjeno' value:", usluga.namjenjeno);

          // Check if any of the selected options match the 'namjenjeno' field of the service
          return options.some((option) =>
            usluga.namjenjeno.toLowerCase().includes(option.toLowerCase())
          );
        }

        if (category === "Ustanova pružanja usluge") {
          console.log("Checking Vrste korisnika filter options:", options);
          console.log("Service 'namjenjeno' value:", usluga.namjenjeno);

          // Check if any of the selected options match the 'namjenjeno' field of the service
          return options.some((option) =>
            usluga.pruzatelj.toLowerCase().includes(option.toLowerCase())
          );
        }
        if (category === "Radno vrijeme") {
          const mappedTime: number[] = options
            .map(
              (option) =>
                filterMappingTime[option as keyof typeof filterMappingTime]
            )
            .filter((value) => typeof value === "number"); // Ensure only valid numbers are mapped

          // Log the selected options and mapped values
          console.log("Selected Trošak options:", options);
          console.log("Mapped Trošak values:", mappedTime);
          console.log("Service 'trosak' value:", usluga.trosak);

          // Check if the mapped options intersect with the "trosak" value of the location
          return mappedTime.length === 0 || mappedTime.includes(usluga.trosak);
        }
        // Handle filtering for "Lokacije" filter (kategorija array)
        // Handle filtering for "Lokacije" filter (kategorija array)
        if (category === "Lokacije") {
          const locationValues = options
            .map((option) => {
              // Normalize the key (trimmed and lowercase) for mapping
              const normalizedOption = option.trim().toLowerCase();

              // Find the corresponding key in lokacijeMapping by normalizing it
              const mappedValue = Object.entries(lokacijeMapping).find(
                ([key]) => key.trim().toLowerCase() === normalizedOption
              )?.[1];

              console.log(`Mapping option "${option}" to "${mappedValue}"`);
              return mappedValue ?? -1; // Fallback for unmapped
            })
            .filter((value) => value !== -1); // Remove invalid mappings

          console.log("Mapped location values (normalized):", locationValues);

          const matchesLocation = locationValues.some((locValue) =>
            usluga.kategorija.includes(locValue)
          );

          console.log("Service's kategorija:", usluga.kategorija);
          console.log("Matches location filter:", matchesLocation);

          return locationValues.length === 0 || matchesLocation;
        }

        // Handle filtering based on arrays like "kategorija"
        if (Array.isArray(categoryValue)) {
          return options.some((option) =>
            categoryValue.includes(Number(option))
          );
        }

        if (typeof categoryValue === "string") {
          return options.some((option) =>
            categoryValue.toLowerCase().includes(option.toLowerCase())
          );
        }

        return false; // If no valid category matches, return false
      }
    );

    return matchesSearch && matchesFilters; // Return true if both search and filters match
  };

  const updateFilteredMatches = () => {
    const filteredData = popisUsluga.filter((usluga: Usluga) =>
      spadaLiUFilter(usluga, selectedFilters)
    );
    setFilteredMatches(filteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    setSelectedFilters(filters);
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
        <ScrollableMenu onCategoryClick={handleButtonClick} />
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
