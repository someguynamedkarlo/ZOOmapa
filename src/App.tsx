import { useState, useEffect } from "react";
import "./CSS/App.css";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";
import fetchData from "./supabase";
import ScrollableMenu from "./ScrollableMenu";
function App() {
  const serviceMapping: { [key: string]: number } = {
    "Domovi zdravlja": 2,
    Bolnice: 1,
    Ljekarne: 3,
    Poliklinike: 4,
    "Prevencija ovisnosti": 5,
    Psiholozi: 6,
  };

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    45.32560918851513, 14.44176433327116,
  ]);
  const [filteredMatches, setFilteredMatches] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]); // Store fetched data

  useEffect(() => {
    const loadData = async () => {
      // Construct filters based on selected filters
      const filters: { pay?: number; type?: number[] } = {};
      if (selectedFilters.includes("Besplatne usluge")) {
        filters.pay = 0; // Free services
      } else if (selectedFilters.includes("Usluge s naplatom")) {
        filters.pay = 1; // Paid services
      }

      // Extract selected service types
      const types = selectedFilters
        .filter((filter) => serviceMapping[filter] !== undefined)
        .map((filter) => serviceMapping[filter]);

      if (types.length > 0) {
        filters.type = types; // Only include selected types
      }

      const fetchedData = await fetchData(filters); // Pass filters to fetchData
      setData(fetchedData);
    };
    loadData();
  }, [selectedFilters]); // Re-fetch data whenever filters change

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    // Flatten the filters object into an array of selected options
    const selectedOptions = Object.values(filters).flat();
    setSelectedFilters(selectedOptions);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const resetSearch = () => {
    setSearchTerm("");
  };

  const updateFilteredMatches = () => {
    if (!searchTerm.trim()) {
      setFilteredMatches([]); // Clear results if searchTerm is empty
      return;
    }

    const filteredData = data
      .filter((location) => {
        // Ensure pay and type match the selected filters (AND condition)
        const matchesPay =
          (selectedFilters.includes("Besplatne usluge") &&
            location.Pay === 0) ||
          (selectedFilters.includes("Usluge s naplatom") && location.Pay === 1);

        const matchesType = selectedFilters.some((filter) => {
          const typeMatch = serviceMapping[filter];
          return typeMatch === location.Type;
        });

        // Return if both conditions are satisfied (AND logic)
        return matchesPay && matchesType;
      })
      .filter((location) =>
        location.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredMatches(filteredData);
  };

  useEffect(() => {
    updateFilteredMatches(); // Update filtered matches whenever data, filters, or searchTerm changes
  }, [data, selectedFilters, searchTerm]);

  const handleSearchResultClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    resetSearch(); // Update map center when search result is clicked
  };

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
            placeholder=""
            aria-label="Your field name"
            id="searchbar"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ paddingRight: "20px" }} // Space for the icon
          />
        </div>
        <DropdownWithCheckboxes onFilterChange={handleFilterChange} />
        {filteredMatches.length > 0 && (
          <div className="search-results">
            <div>
              {filteredMatches.slice(0, 5).map((result, index) => (
                <div
                  key={index}
                  className="search-result"
                  onClick={() => handleSearchResultClick(result.Y, result.X)}
                >
                  {result.Name}
                </div>
              ))}
            </div>
          </div>
        )}
        <ScrollableMenu />
      </div>
      <MapComponent
        selectedFilters={selectedFilters}
        searchTerm={searchTerm}
        mapCenter={mapCenter}
      />
    </div>
  );
}

export default App;
