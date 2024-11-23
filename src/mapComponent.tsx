import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import MarkerClusterGroup from "react-leaflet-cluster";
import psihoslik from "./icons/psiho.webp";
import prevencijaslik from "./icons/prevencija2.webp";
import domslik from "./icons/dom3.webp";
import bolnicaslik from "./icons/bolnica.webp";
import ljekarnaslik from "./icons/ljekarna.webp";
import polislik from "./icons/poli.webp";
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
const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";
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
    1: bolnicaslik,
    2: domslik,
    3: ljekarnaslik, // TOD
    4: polislik, // TOD
    5: prevencijaslik,
    6: psihoslik,
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

  const displayedData = searchTerm ? filteredData.slice(0, 10) : filteredData;

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      // You can send this data to App.tsx if needed
    };
    loadData();
  }, []);
  return (
    <MapContainer
      style={{ height: "92%", width: "100%" }}
      center={[45.32560918851513, 14.44176433327116]}
      zoom={14}
      minZoom={11}
      scrollWheelZoom={true}
    >
      <TileLayer
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${apiKey}`}
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <MarkerClusterGroup maxClusterRadius={25} spiderfyOnMaxZoom={true}>
        {displayedData.map((location, index) => (
          <Marker
            key={index}
            position={[location.Y, location.X]}
            icon={L.icon({
              iconUrl:
                iconMapping[location.Type] || "https://i.imgur.com/9fP8Ot2.png",
              iconSize: [40, 40],
            })}
          >
            <Popup>
              <h4>{location.Name}</h4>
              {location.adresa || "Adresa nije dostupna"}
              <br />
              {location.kontakt || "Kontakt nije dostupan"}
              <br />
              <a
                href={location.mapslink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Otvori na Google kartama
              </a>
              <br />
              {location.web ? (
                <a
                  href={`https://${location.web}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Otvori web stranicu
                </a>
              ) : (
                "Web stranica nije dostupna :("
              )}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
