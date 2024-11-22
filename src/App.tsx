import { useState, useEffect } from "react";
import "./CSS/App.css";
import DropdownWithCheckboxes from "./DropdownWithCheckboxes";
import MapComponent from "./mapComponent";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB0xVPcTwZb5vYCZZKYPr8uimM8nKxM900",
  authDomain: "mapa-fe85d.firebaseapp.com",
  databaseURL:
    "https://mapa-fe85d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mapa-fe85d",
  storageBucket: "mapa-fe85d.firebasestorage.app",
  messagingSenderId: "1061731964525",
  appId: "1:1061731964525:web:7b1aecf2d5c3a04caad164",
  measurementId: "G-63RZV3H9KB",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const fetchData = async () => {
  const dbRef = ref(db, "/");
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};
function App() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<any[]>([]); // Holds the raw data
  const [filteredData, setFilteredData] = useState<any[]>([]); // Holds the filtered data

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };

    loadData();
  }, []);

  // Filter the data whenever selectedFilters or searchTerm changes
  useEffect(() => {
    const filtered = data
      .filter((location) => {
        // Filter by selected filters
        const matchesPay =
          (selectedFilters.includes("Besplatne usluge") &&
            location.Pay === 0) ||
          (selectedFilters.includes("Usluge s naplatom") && location.Pay === 1);

        const matchesType = selectedFilters.some((filter) => {
          const serviceMapping: { [key: string]: number } = {
            "Domovi zdravlja": 2,
            Bolnice: 1,
            Ljekarne: 3,
            Poliklinike: 4,
            "Prevencija ovisnosti": 5,
            Psiholozi: 6,
          };

          const typeMatch = serviceMapping[filter];
          return typeMatch === location.Type;
        });

        return matchesPay || matchesType || selectedFilters.length === 0;
      })
      .filter((location) => {
        // Filter by search term
        if (searchTerm) {
          return location.Name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      });

    setFilteredData(filtered);
  }, [data, selectedFilters, searchTerm]); // Run whenever data, selectedFilters, or searchTerm changes

  return (
    <>
      <div className="gore">
        <input
          type="text"
          placeholder="Pretraži"
          id="searchbar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <DropdownWithCheckboxes onFilterChange={handleFilterChange} />
        {searchTerm && (
          <div className="search-results">
            {filteredData.slice(0, 5).map((match) => (
              <label key={match.id} className="search-result">
                {match.Name}
              </label>
            ))}
          </div>
        )}
      </div>
      <MapComponent selectedFilters={selectedFilters} searchTerm={searchTerm} />{" "}
    </>
  );
}

export default App;
