import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import psihoslik from "./icons/psiho.webp";
import prevencijaslik from "./icons/prevencija2.webp";
import domslik from "./icons/dom3.webp";
import bolnicaslik from "./icons/bolnica.webp";
import ljekarnaslik from "./icons/ljekarna.webp";
import polislik from "./icons/poli.webp";
import fetchData from "./firebase";

const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";

interface MapComponentProps {
  selectedFilters: string[];
  searchTerm: string;
  mapCenter: [number, number]; // Add mapCenter prop
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedFilters,
  searchTerm,
  mapCenter,
}) => {
  const [data, setData] = useState<any[]>([]);
  const mapRef = useRef<L.Map | null>(null); // Reference to Leaflet map instance

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
    3: ljekarnaslik,
    4: polislik,
    5: prevencijaslik,
    6: psihoslik,
  };

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
      // Only filter by searchTerm if it's not empty, otherwise include all results
      if (searchTerm.trim() !== "") {
        return location.Name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true; // Return true to include all locations if searchTerm is empty
    });

  const displayedData = searchTerm ? filteredData.slice(0, 10) : filteredData;

  // Recenter map and zoom when mapCenter changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(mapCenter[0], mapCenter[1]), 17); // Adjust zoom level to 17
    }
  }, [mapCenter]);

  return (
    <MapContainer
      style={{ height: "92%", width: "100%" }}
      center={[45.32560918851513, 14.44176433327116]} // Default center
      zoom={14}
      minZoom={11}
      scrollWheelZoom={true}
      ref={mapRef}
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
