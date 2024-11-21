import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import MarkerClusterGroup from "react-leaflet-cluster";

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

interface MapComponentProps {
  selectedFilters: string[];
  searchTerm: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedFilters,
  searchTerm,
}) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
    };
    loadData();
  }, []);

  const serviceMapping: { [key: string]: number } = {
    "Domovi zdravlja": 2,
    Bolnice: 1,
    Ljekarne: 3,
    Poliklinike: 4,
    "Prevencija ovisnosti": 5,
    Psiholozi: 6,
  };

  const iconMapping: { [key: number]: string } = {
    1: "https://i.imgur.com/9fP8Ot2.png", // Bolnice
    2: "https://i.imgur.com/oLSdHCb.png", // Domovi zdravlja
    3: "https://i.imgur.com/zPPS039.png", // Ljekarne
    4: "https://i.imgur.com/DdQi5p2.png", // Poliklinike
    5: "https://i.imgur.com/VSY8Ca9.png", // Prevencija ovisnosti
    6: "https://i.imgur.com/V5NaCqC.png", // Psiholozi
  };

  // Filter based on selected filters
  const filteredData = data
    .filter((location) => {
      const matchesPay =
        (selectedFilters.includes("Besplatne usluge") && location.Pay === 0) ||
        (selectedFilters.includes("Usluge s naplatom") && location.Pay === 1);

      const matchesType = selectedFilters.some((filter) => {
        const typeMatch = serviceMapping[filter];
        return typeMatch === location.Type;
      });

      return matchesPay || matchesType || selectedFilters.length === 0;
    })
    .filter((location) => {
      if (searchTerm) {
        return location.Name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

  const displayedData = searchTerm ? filteredData.slice(0, 5) : filteredData;

  return (
    <MapContainer
      style={{ height: "92%", width: "100%" }}
      center={[45.32560918851513, 14.44176433327116]}
      zoom={14}
      minZoom={12}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup maxClusterRadius={25} spiderfyOnMaxZoom={true}>
        {displayedData.map((location, index) => (
          <Marker
            key={index}
            position={[location.Y, location.X]}
            icon={L.icon({
              iconUrl:
                iconMapping[location.Type] || "https://i.imgur.com/9fP8Ot2.png",
              iconSize: [90, 90],
            })}
          >
            <Popup>
              <h4>{location.Name}</h4>
              {location.adresa || "Adresa nije dostupna"}
              <br />
              {location.kontakt || "Kontakt nije dostupan"}
              <br />
              <a href={location.mapslink}>Otvori na Google kartama</a>
              <br />
              <a href={location.web}>Otvori web strancu</a>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
