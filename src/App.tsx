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
  "zdravstveno osiguranje": 0,
  "USLUGE (SPECIFIČNO) ZA MLADE": 1,
  "USLUGE (SPECIFIČNO) ZA DJECU": 2,
  "PREVENCIJA - PROMICANJE ZDRAVLJA I SUZBIJANJE BOLESTI": 3,
  "ZDRAVSTVENI ODGOJ I OBRAZOVANJE": 4,
  "OBITELJSKA MEDICINA / OPĆA PRAKSA": 5,
  "HITNA MEDICINSKA POMOĆ": 6,
  BOLNICE: 7,
  "PSIHIJATRIJSKO LIJEČENJE": 8,
  "PSIHOLOŠKO SAVJETOVANJE/POMOĆ": 9,
  "OSTALE SPECIJALIZIRANE USLUGE SAVJETOVANJA": 10,
  "PODRŠKA OVISNICIMA": 11,
  "ZDRAVLJE ŽENA I REPRODUKTIVNO ZDRAVLJE": 12,
  "PODRŠKA OBOLJELIMA I REHABILITACIJA": 13,
  STOMATOLOZI: 14,
  "LJEKARNE S DEŽURSTVIMA": 15,
  "LJEKARNE BEZ DEŽURSTAVA": 16,
  VETERINARI: 17,
  "PRIVATNE BOLNICE I POLIKLINIKE": 18,
  "OSTALE USLUGE - NEKATEGORIZIRANO": 19,
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
    kategorija: number[];
  }

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
            .map(
              (option) =>
                lokacijeMapping[option as keyof typeof lokacijeMapping] ?? -1
            ) // Use a fallback if not found
            .filter((value) => value !== -1); // Remove invalid ones

          console.log("Mapped location values with fallback:", locationValues);
          // Ensure only valid numbers are mapped

          console.log("Location filter selected options:", options);
          console.log("Mapped location values:", locationValues);

          // Check if any of the locationValues is present in the usluga.kategorija array
          const matchesLocation = locationValues.some((locValue) =>
            usluga.kategorija.includes(locValue)
          );

          console.log("Checking service's kategorija:", usluga.kategorija);
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
