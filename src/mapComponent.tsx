import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import psihoslik from "./icons/psiho.webp";
import prevencijaslik from "./icons/prevencija2.webp";
import domslik from "./icons/dom3.webp";
import bolnicaslik from "./icons/bolnica.webp";
import ljekarnaslik from "./icons/ljekarna.webp";
import polislik from "./icons/poli.webp";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./CSS/App.css";
const MapComponent = ({
  mapCenter,
  data,
  mapRef,
}: {
  mapCenter: [number, number];
  data: any[]; // Consider typing this as Usluga[] if possible
  mapRef: React.RefObject<L.Map>; // Ref type without null
  apiKey: string;
}) => {
  const iconMapping: { [key: number]: string } = {
    1: bolnicaslik,
    2: domslik,
    3: ljekarnaslik,
    4: polislik,
    5: prevencijaslik,
    6: psihoslik,
  };
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(mapCenter[0], mapCenter[1]), 17);
    }
  }, [mapCenter]);

  const handleMarkerClick = (lat: number, lng: number, index: number) => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng), 17);
      markersRef.current[index].openPopup();
    }
  };

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={mapCenter}
      zoom={14}
      minZoom={11}
      scrollWheelZoom={true}
      ref={mapRef} // Corrected ref type
      zoomControl={false}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup maxClusterRadius={25} spiderfyOnMaxZoom={true}>
        {filteredData.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={L.icon({
              iconUrl:
                iconMapping[parseInt(location.kategorija[0])] ||
                "default_icon.png", // Fixed handling for icon keys
              iconSize: [40, 40],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(location.lat, location.lng, index),
            }}
            ref={(el) => (markersRef.current[index] = el)}
          >
            <Popup>
              <h3>{location.imeUstanove}</h3>
              {location.adresa || "Adresa nije dostupna"}
              <br />
              {location.telefon || "Kontakt nije dostupan"}
              <br />
              <h4>
                <a
                  href={location.web}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Web stranica
                </a>
              </h4>
              <p id="p">
                <h4>Email:</h4> {location.email || "Email nije dostupan"}
              </p>
              <p id="p">
                <h4>Opis:</h4> {location.opis || "Opis nije dostupan"}
              </p>
              <p id="p">
                <h4>Preduvjeti:</h4>{" "}
                {location.preduvjeti || "Preduvjeti nisu dostupani"}
              </p>
              <p id="p">
                <h4>Specifična usluga:</h4>{" "}
                {location.specUsluga || "Specifična usluga nije dostupna"}
              </p>
              <p id="p">
                <h4>Radno vrijeme:</h4>{" "}
                {location.radnoVrijeme || "Radno vrijeme nije dostupno"}
              </p>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
