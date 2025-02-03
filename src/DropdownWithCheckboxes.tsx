import { useState } from "react";
import "./CSS/menu.css";
import { Filter } from "./Filter";
import { AllCategories, AllKategorijaKorisnika, AllTipVlasnikaUsluge, AllTrosak, kategorijaKorisnikaToString, kategorijaToString, tipVlasnikaToString, trosakKorisnikaToString } from "./Usluge";

interface DropdownProps {
  onFilterChange: (newFilter: Filter) => void;
  filters: Filter;
  dropdownVisible: boolean,
  toggleFilterDrowdown: () => void;
}

type SingleFilterEntry = {
  title: string,
  options: string[],
  onChange: (i: number, oldFilter: Filter) => Filter,
  isSelected: (i: number, filter: Filter) => boolean,
};

const filterData: SingleFilterEntry[] = [
  {
    title: "Vrsta usluge",
    options: AllCategories.map(k => kategorijaToString(k)),
    onChange(i, oldFilter) {
      const change = AllCategories[i];
      return {
        ...oldFilter,
        kategorije: oldFilter.kategorije.includes(change) ?
          oldFilter.kategorije.filter(k => k !== change) : oldFilter.kategorije.concat(change)
      }
    },
    isSelected(i, filter) {
      return filter.kategorije.includes(AllCategories[i]);
    },
  },
  {
    title: "Vrsta ustanove",
    options: AllTipVlasnikaUsluge.map(k => tipVlasnikaToString(k)),
    onChange(i, oldFilter) {
      const change = AllTipVlasnikaUsluge[i];
      return {
        ...oldFilter,
        vrstaUstanove: oldFilter.vrstaUstanove.includes(change) ?
          oldFilter.vrstaUstanove.filter(k => k !== change) : oldFilter.vrstaUstanove.concat(change)
      }
    },
    isSelected(i, filter) {
      return filter.vrstaUstanove.includes(AllTipVlasnikaUsluge[i]);
    },
  },
  {
    title: "Vrsta korisnika",
    options: AllKategorijaKorisnika.map(k => kategorijaKorisnikaToString(k)),
    onChange(i, oldFilter) {
      const change = AllKategorijaKorisnika[i];
      return {
        ...oldFilter,
        kategorijaKorisnika: oldFilter.kategorijaKorisnika.includes(change) ?
          oldFilter.kategorijaKorisnika.filter(k => k !== change) : oldFilter.kategorijaKorisnika.concat(change)
      }
    },
    isSelected(i, filter) {
      return filter.kategorijaKorisnika.includes(AllKategorijaKorisnika[i]);
    },
  },
  {
    title: "Cijena",
    options: AllTrosak.map(k => trosakKorisnikaToString(k)),
    onChange(i, oldFilter) {
      const change = AllTrosak[i];
      return {
        ...oldFilter,
        trosakKorisnika: oldFilter.trosakKorisnika.includes(change) ?
          oldFilter.trosakKorisnika.filter(k => k !== change) : oldFilter.trosakKorisnika.concat(change)
      }
    },
    isSelected(i, filter) {
      return filter.trosakKorisnika.includes(AllTrosak[i]);
    },
  },
]

function DropdownWithCheckboxes({ filters, onFilterChange, dropdownVisible, toggleFilterDrowdown }: DropdownProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);


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
      <button className="dropdown-button" onClick={toggleFilterDrowdown}>
        <div style={{ marginRight: 10 }}>
          Filteri{" "}
        </div>
        <i className={`fa fa-chevron-down ${dropdownVisible ? "open" : ""}`} />
      </button>
      <div className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}>
        { filterData.map((filter) => (
          <div key={filter.title} className="filter-section">
            <div
              className="category-header"
              onClick={() => toggleCategory(filter.title)}
            >
              <span>{filter.title}</span>
              <i
                className={`fa fa-chevron-${
                  expandedCategories.includes(filter.title) ? "up" : "down"
                } category-icon`}
              />
            </div>
            { expandedCategories.includes(filter.title) && (
              <div className="filter-options">
                { ["SVE"].concat(filter.options).map((option, index) => (
                  <div key={`${filter.title}-${option}`} className="filter-option">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: 12, paddingBottom: 12 }}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        id={`${filter.title}-${option}`}
                        checked={
                          index === 0 ?
                          filter.options.find((_, i) => !filter.isSelected(i, filters)) === undefined
                          :
                          filter.isSelected(index-1, filters)
                        }
                        onChange={() => {
                          if (index === 0) {
                            const isSelected = filter.options.find((_, i) => !filter.isSelected(i, filters)) === undefined;
                            let newFilters = filters;
                            filter.options.forEach((_, i) => {
                              if (filter.isSelected(i, newFilters) === isSelected) {
                                newFilters = filter.onChange(i, newFilters);
                              }
                            });
                            onFilterChange(newFilters)
                          }
                          else onFilterChange(filter.onChange(index-1, filters))
                        }}
                        aria-labelledby={option}
                      />
                      <label htmlFor={`${filter.title}-${option}`} style={
                        index === 0 ? { fontWeight: "bold", width: "100%" } : { width: "100%" }
                      }>
                        {option}
                      </label>
                    </div>
                    { index === 0 &&
                      <div style={{ backgroundColor: "darkgray", width: "100%", height: 0.5 }}></div>
                    }
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownWithCheckboxes;
