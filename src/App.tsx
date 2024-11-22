import { useState } from "react";
import "./App.css";
import "./firebase";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";

function App() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update search term
  };

  return (
    <>
      <div className="gore">
        <input
          type="text"
          placeholder="Pretraži"
          id="searchbar"
          value={searchTerm}
          onChange={handleSearchChange} // Call the handler
        />
        <DropdownWithCheckboxes onFilterChange={handleFilterChange} />
      </div>
      <MapComponent selectedFilters={selectedFilters} searchTerm={searchTerm} />{" "}
      {/* Pass searchTerm to MapComponent */}
    </>
  );
}

export default App;
