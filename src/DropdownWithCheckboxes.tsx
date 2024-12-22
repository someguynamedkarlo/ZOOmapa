import { useState } from "react";
import "./CSS/menu.css";

interface DropdownProps {
  onFilterChange: (filters: { [key: string]: string[] }) => void;
}

const filterData = [
  {
    category: "Lokacije",
    options: [
      "Zdravstveno osiguranje",
      "Usluge (specifično) za mlade",
      "Usluge (specifično) za djecu",
      "Prevencija -promicanje zdravlja",
      "Zdravstveni odgoj i obrazovanje",
    ],
  },
  {
    category: "Ustanova pružanja usluge",
    options: ["Javna (državna) ustanova", "Privatna ustanova", "Udruga - NVO"],
  },
  {
    category: "Vrsta korisnika",
    options: [
      "Sve dobne skupine",
      "Mlade punoljetne osobe",
      "Djeca (do 13 godina)",
      "Osobe s invaliditetom",
    ],
  },
  {
    category: "Trošak za korisnike",
    options: [
      "Besplatno",
      "Naplata sukladno cjeniku usluga",
      "Pojedine usluge uz nadoplatu",
    ],
  },
  {
    category: "Radno vrijeme",
    options: ["Ponedjeljak - Petak", "Subota", "Rad nedjeljom"],
  },
];

function DropdownWithCheckboxes({ onFilterChange }: DropdownProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleCheckboxChange = (category: string, option: string) => {
    const updatedCategory = selectedFilters[category]?.includes(option)
      ? selectedFilters[category].filter((item) => item !== option)
      : [...(selectedFilters[category] || []), option];

    const updatedFilters = {
      ...selectedFilters,
      [category]: updatedCategory,
    };

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(
        expandedCategories.filter((cat) => cat !== category)
      );
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={toggleDropdown}>
        Filteri{" "}
        <i className={`fa fa-chevron-down ${dropdownVisible ? "open" : ""}`} />
      </button>
      <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
        {filterData.map((filter) => (
          <div key={filter.category} className="filter-section">
            <div
              className="category-header"
              onClick={() => toggleCategory(filter.category)}
            >
              <span>{filter.category}</span>
              <i
                className={`fa fa-chevron-${
                  expandedCategories.includes(filter.category) ? "up" : "down"
                } category-icon`}
              />
            </div>
            {expandedCategories.includes(filter.category) && (
              <div className="filter-options">
                {filter.options.map((option) => (
                  <div key={option} className="filter-option">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={`${filter.category}-${option}`}
                      checked={
                        selectedFilters[filter.category]?.includes(option) ||
                        false
                      }
                      onChange={() =>
                        handleCheckboxChange(filter.category, option)
                      }
                      aria-labelledby={option}
                    />
                    <label htmlFor={`${filter.category}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          className="filter-apply-button"
          onClick={() => console.log(selectedFilters)}
        >
          Primjeni
        </button>
      </div>
    </div>
  );
}

export default DropdownWithCheckboxes;
