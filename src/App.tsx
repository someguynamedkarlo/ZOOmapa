import { useState, useEffect, useRef } from "react";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";

import "./CSS/App.css";
import "./CSS/gore.css";

import ScrollableMenu from "./ScrollableMenu";
import L from "leaflet";
import ButonC from "./butonC";
import { Usluga } from "./Usluge";
import fetchData from "./supabase";
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

// Return lower number to appear before in the search result
// Return null if the search is no match
function searchResultSortNumber(usluga: Usluga, searchText: string): number | null {
  const search = searchText.trim().toLocaleLowerCase();
  if (search.length < 2) return null;
  else if (usluga.imeUstanove.trim().toLocaleLowerCase().includes(search)) return 1;
  else if (usluga.pruzatelj.trim().toLocaleLowerCase().includes(search)) return 2;
  else if (usluga.opis.trim().toLocaleLowerCase().includes(search)) return 3;
  else if (usluga.specUsluga.trim().toLocaleLowerCase().includes(search)) return 4;
  else if (usluga.adresa.trim().toLocaleLowerCase().includes(search)) return 5;
  else if (usluga.telefon.trim().toLocaleLowerCase().includes(search)) return 6;
  else if (usluga.email.trim().toLocaleLowerCase().includes(search)) return 7;
  else if (usluga.web.trim().toLocaleLowerCase().includes(search)) return 8;
  else if (usluga.radnoVrijeme.trim().toLocaleLowerCase().includes(search)) return 9;
  else if (usluga.preduvjeti.trim().toLocaleLowerCase().includes(search)) return 10;
  else if (usluga.namjenjeno.trim().toLocaleLowerCase().includes(search)) return 11;
  else return null
}

function App() {
  const [popisUsluga, setPopisUsluga] = useState<Usluga[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter] = useState<[number, number]>([
    45.32560918851513, 14.44176433327116,
  ]);
  const [filteredMatches, setFilteredMatches] = useState<Usluga[]>([]);

  const [topResults, setTopResults] = useState<Usluga[]>([]);
  const [idToOpenPopup, setIdToOpenPopup] = useState<number | null>(null);

  const isSearchingText = searchTerm.length > 2;
  
  const handleQuickFilterButtonClick = (categoryLabel: string) => {
    const mappedCategory = Object.entries(lokacijeMapping).find(
      ([key]) => key.trim().toLowerCase() === categoryLabel.trim().toLowerCase()
    )?.[1];

    if (mappedCategory !== undefined) {
      setSelectedFilters((prevFilters) => {
        const currentLocations = prevFilters.Lokacije || [];

        // Check if the clicked category is already in the filter
        if (currentLocations.includes(categoryLabel)) {
          // Remove the category if it's already selected
          return { Lokacije: [] };
          // return {
          //   ...prevFilters,
          //   Lokacije: currentLocations.filter((loc) => loc !== categoryLabel),
          // };
        } else {
          // Add the category to the selected filters
          return { Lokacije: [categoryLabel] };
          // return {
          //   ...prevFilters,
          //   Lokacije: [...currentLocations, categoryLabel],
          // };
        }
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
          console.log("Service 'trosak' value:", usluga.radVrijeme2.toString());
          if (usluga.radVrijeme2) return true;
          // Check if the mapped options intersect with the "trosak" value of the location
          return (
            mappedTime.length === 0 || mappedTime.includes(usluga.radVrijeme2)
          );
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
    
    type sortAndUsluga = { sort: number, u: Usluga };
    if (isSearchingText) {
      const filteredData: sortAndUsluga[] = popisUsluga
        .map((u) => ({ sort: searchResultSortNumber(u, searchTerm), u: u }))
        .filter(u => u.sort !== null)
        .map(u => u as sortAndUsluga);

      setFilteredMatches(filteredData.map(element => element.u));

      const sortedData = filteredData.sort((a, b) => a.sort - b.sort);
      setTopResults(sortedData.map(element => element.u));
    } else {
      const filteredData = popisUsluga.filter((usluga: Usluga) =>
        spadaLiUFilter(usluga, selectedFilters)
      );
      setFilteredMatches(filteredData);
      setTopResults([]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setIdToOpenPopup(null);
    }
  };
  const handleSearchResultClick = (lat: number, lng: number, id: number) => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng), 18); // Zoom to the clicked location
    }
    setIdToOpenPopup(id)
    setSearchTerm("");
  };

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    setSelectedFilters(filters);
  };
  useEffect(() => {
    // Call the function when filters, search term change or when data loads
    updateFilteredMatches();
  }, [selectedFilters, searchTerm, popisUsluga]);

  useEffect(() => {
    const asyncFetch = async () => {
      const sveUsluge = await fetchData();
      setPopisUsluga(sveUsluge);
    }
    asyncFetch().catch(console.error);
  }, []);

  return (
    <div id="app">
      <div className="gore">
        <div className="moblina-prvi-redak">
          <div id="searchbar-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
              width="20" height="20" id="search-icon"
              onClick={() => setSearchTerm("")}
            >
            {/* From https://fontawesome.com/search?ip=classic&s=solid&o=r */}
            {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
            { isSearchingText ?
              <path fill="white" stroke="white" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
              :
              <path fill="white" stroke="white" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            }
            </svg>
            <input
              type="text"
              className="search-input-field"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
          </div>
          <DropdownWithCheckboxes onFilterChange={handleFilterChange} />
        </div>
        <ScrollableMenu onCategoryClick={handleQuickFilterButtonClick} />
      </div>

      { isSearchingText && (
        <ul className="search-results">
          { topResults.map(result => (
            <li
              key={result.id}
              className="search-result"
              onClick={() =>
                handleSearchResultClick(result.lat, result.lng, result.id)
              }
            >
              {result.imeUstanove} ({result.adresa})
            </li>
          ))}
          { topResults.length === 0 && isSearchingText &&
            <li
              key={"no-results"}
              className="search-result"
            >
              Nema rezultata
            </li>
          }
        </ul>
      )}

      <MapComponent
        mapCenter={mapCenter}
        data={filteredMatches}
        mapRef={mapRef}
        idToOpenPopup={idToOpenPopup}
      >
        <ButonC></ButonC>
      </MapComponent>
    </div>
  );
}

export default App;
