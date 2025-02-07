import { useState, useEffect, useRef } from "react";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";

import "./CSS/App.css";
import "./CSS/gore.css";

import ScrollableMenu from "./ScrollableMenu";
import L from "leaflet";
import ButonC from "./butonC";
import { kategorijaKorisnikaToString, kategorijaToString, tipVlasnikaToString, trosakKorisnikaToString, Usluga } from "./Usluge";
import fetchData from "./supabase";
import { Filter, makeBolniceIOrdinacijeFilter, makeDefaultFilter, makeHitnoFilter, makeLjekarneFilter, makeVeterinariFilter, QuickFilter, spadaLiUFilter } from "./Filter";
import { MAX_ZOOM } from "./constants";
import { croatiaStringIncludes } from "./Utils";

// Return lower number to appear before in the search result
// Return null if the search is no match
function searchResultSortNumber(usluga: Usluga, searchText: string): number | null {
  const search = searchText.trim().toLocaleLowerCase();
  if (search.length < 2) return null;
  else if (croatiaStringIncludes(usluga.imeUstanove, search)) return 1;
  else if (croatiaStringIncludes(usluga.nazivUsluge, search)) return 2;
  else if (croatiaStringIncludes(usluga.opisUsluge, search)) return 3;
  else if (croatiaStringIncludes(kategorijaToString(usluga.kategorija), search)) return 4;
  else if (usluga.ostaleKategorije.find(kat => croatiaStringIncludes(kategorijaToString(kat), search)) !== undefined) return 5;
  else if (croatiaStringIncludes(usluga.adresa, search)) return 6;
  else if (croatiaStringIncludes(usluga.web, search)) return 7;
  else if (croatiaStringIncludes(usluga.dodatneInfo, search)) return 8;
  else if (croatiaStringIncludes(usluga.telefon, search)) return 9;
  else if (croatiaStringIncludes(usluga.email, search)) return 10;
  else if (usluga.javnoIliPrivatno !== null && 
    croatiaStringIncludes(tipVlasnikaToString(usluga.javnoIliPrivatno), search)) return 11;
  else if (usluga.kategorijaKorisnika !== null && 
    croatiaStringIncludes(kategorijaKorisnikaToString(usluga.kategorijaKorisnika), search)) return 12;
  else if (usluga.trosakKorisnika !== null && 
    croatiaStringIncludes(trosakKorisnikaToString(usluga.trosakKorisnika), search)) return 13;
  else return null
}

function App() {
  const [popisUsluga, setPopisUsluga] = useState<Usluga[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter>(makeDefaultFilter());
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter] = useState<[number, number]>([
    45.32560918851513, 14.44176433327116,
  ]);
  const [filteredMatches, setFilteredMatches] = useState<Usluga[]>([]);

  const [idToOpenPopup, setIdToOpenPopup] = useState<number | null>(null);

  const [oKartiPopupVisible, setOKartiPopupVisible] = useState(false);

  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const isSearchingText = searchTerm.length > 2;
  
  const handleQuickFilterButtonClick = (quickFilter: QuickFilter | null) => {
    switch(quickFilter) {
      case QuickFilter.HITNO: {
        setSelectedFilters(makeHitnoFilter());
        break;
      }
      case QuickFilter.BOLNICE_I_ORDINACIJE: {
        setSelectedFilters(makeBolniceIOrdinacijeFilter());
        break;
      }
      case QuickFilter.LJEKARNE: {
        setSelectedFilters(makeLjekarneFilter());
        break;
      }
      case QuickFilter.VETERINARI: {
        setSelectedFilters(makeVeterinariFilter());
        break;
      }
      case null: {
        setSelectedFilters(makeDefaultFilter());
        break;
      }
    }
  };

  const mapRef = useRef<L.Map | null>(null);

  const updateFilteredMatches = () => {
    
    type sortAndUsluga = { sort: number, u: Usluga };

    const filteredData: Usluga[] = popisUsluga.filter((usluga: Usluga) =>
      spadaLiUFilter(usluga, selectedFilters)
    );
    let finalFilteredData: Usluga[]

    if (isSearchingText) {
      const sortedFiltered = filteredData
        .map((u) => ({ sort: searchResultSortNumber(u, searchTerm), u: u }))
        .filter(u => u.sort !== null)
        .map(u => u as sortAndUsluga);

      const sortedData = sortedFiltered.sort((a, b) => a.sort - b.sort);
      finalFilteredData = sortedData.map(element => element.u);
    } else {
      finalFilteredData = filteredData;
    }

    setFilteredMatches(finalFilteredData);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setIdToOpenPopup(null);
    }
  };
  const handleSearchResultClick = (lat: number, lng: number, id: number) => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng), MAX_ZOOM); // Zoom to the clicked location
    }
    setIdToOpenPopup(id)
    setSearchTerm("");
  };
  
  const onEmptyMapClick = () => {
    if (searchTerm !== "") setSearchTerm("");
    if (filterDropdownVisible) setFilterDropdownVisible(false);
    if (oKartiPopupVisible) setOKartiPopupVisible(false);
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
          <DropdownWithCheckboxes
            filters={selectedFilters} onFilterChange={setSelectedFilters}
            dropdownVisible={filterDropdownVisible} toggleFilterDrowdown={toggleFilterDropdown}
          />
        </div>
        <ScrollableMenu onQuickFilterClick={handleQuickFilterButtonClick} />
      </div>
      { popisUsluga.length > 0 && filteredMatches.length === 0 &&
        <div style={{
          position: "absolute", width: "100%", height: "100%", zIndex: 999, alignContent: "center",
          alignItems: "center", textAlign: "center", color: "#555",
          // textShadow: "#888 1px 0 10px",
          textShadow: "1px 1px 2px #888, 0 0 1em #888, 0 0 0.2em #888",
          }}
          onClick={onEmptyMapClick}
          >
          <div style={{ marginTop: 64, fontWeight: "bolder", fontSize: 32, width: "100%", textAlign: "center" }}>
            Nema rezultata!
          </div>
          <div style={{ marginTop: 16, fontWeight: "bolder", fontSize: 20, width: "100%", textAlign: "center" }}>
            Promijenite filter
            <div style={{ marginTop: 12 }}>ili</div>
          </div>
          <div style={{
            display: "inline-block", paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, 
            backgroundColor: "#383838", color: "white", borderRadius: 20, textAlign: "center", cursor: "pointer", border: "none",
            marginTop: 12, fontSize: 18, fontWeight: "bold",
            textShadow: "none"
          }}
            onClick={() => setSelectedFilters(makeDefaultFilter())}
          >
            Resetiraj filter
          </div>
        </div>
      }

      { isSearchingText && (
        <ul className="search-results">
          { filteredMatches.map(result => (
            <li
              key={result.id}
              className="search-result"
              onClick={() =>
                handleSearchResultClick(result.lat, result.lng, result.id)
              }
            >
              {result.imeUstanove} - {result.nazivUsluge} ({result.adresa})
            </li>
          ))}
          { filteredMatches.length === 0 && isSearchingText &&
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
        onMapClick={onEmptyMapClick}
      >
        <ButonC oKartiPopupVisible={oKartiPopupVisible} setOKartiPopupVisible={setOKartiPopupVisible}/>
      </MapComponent>
    </div>
  );
}

export default App;
