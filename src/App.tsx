import { useState, useEffect } from "react";
import "./CSS/App.css";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";
import fetchData from "./firebase";

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
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    loadData();
  }, []);

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
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
        const matchesPay =
          (selectedFilters.includes("Besplatne usluge") &&
            location.Pay === 0) ||
          (selectedFilters.includes("Usluge s naplatom") && location.Pay === 1);

        const matchesType = selectedFilters.some((filter) => {
          const typeMatch = serviceMapping[filter];
          return typeMatch === location.Type;
        });

        return matchesPay || matchesType || selectedFilters.length === 0;
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
      {" "}
      {/* Ensuring the parent div takes full height */}
      <div className="gore">
        <input
          type="text"
          placeholder="Pretraži"
          id="searchbar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
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
