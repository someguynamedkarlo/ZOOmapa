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
import fetchData from "./supabase";
import "./CSS/App.css";
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
  const markersRef = useRef<any[]>([]); // Store refs for markers

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

  useEffect(() => {
    const loadData = async () => {
      const filters: { pay?: number; type?: number[] } = {};

      // Construct filters based on selectedFilters
      if (selectedFilters.includes("Besplatne usluge")) {
        filters.pay = 0;
      } else if (selectedFilters.includes("Usluge s naplatom")) {
        filters.pay = 1;
      }

      const types = selectedFilters
        .filter((filter) => serviceMapping[filter] !== undefined)
        .map((filter) => serviceMapping[filter]);

      if (types.length > 0) {
        filters.type = types;
      }

      const fetchedData = await fetchData(filters); // Fetch filtered data
      setData(fetchedData);
    };
    loadData();
  }, [selectedFilters]); // Re-fetch data whenever selectedFilters change

  // Filter the data based on the searchTerm
  const filteredData = data.filter((location) => {
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

  // Handle marker click to open popup and center map
  const handleMarkerClick = (lat: number, lng: number, index: number) => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng), 17); // Zoom to the clicked marker
      markersRef.current[index].openPopup(); // Open the marker's popup
    }
  };

  // Handle search result click to center the map and open the corresponding marker's popup
  useEffect(() => {
    if (mapCenter) {
      const matchingMarkerIndex = displayedData.findIndex(
        (location) => location.Y === mapCenter[0] && location.X === mapCenter[1]
      );
      if (matchingMarkerIndex !== -1) {
        markersRef.current[matchingMarkerIndex]?.openPopup(); // Open popup for the matching marker
      }
    }
  }, [mapCenter, displayedData]);

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={mapCenter} // Use the passed mapCenter prop
      zoom={14}
      minZoom={11}
      scrollWheelZoom={true}
      ref={mapRef}
      zoomControl={false}
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
            eventHandlers={{
              click: () => handleMarkerClick(location.Y, location.X, index),
            }}
            ref={(el) => (markersRef.current[index] = el)} // Save the marker reference
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
