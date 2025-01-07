import { ReactNode, useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import psihoslik from "./icons/psiho.webp";
import prevencijaslik from "./icons/prevencija2.webp";
import domslik from "./icons/dom3.webp";
import bolnicaslik from "./icons/bolnica.webp";
import ljekarnaslik from "./icons/ljekarna.webp";
import polislik from "./icons/poli.webp";
import orto from "./icons/ortodont.webp";
import obslik from "./icons/ob.webp";
import hitno from "./icons/hitno.webp";
import vet from "./icons/veterinari.webp"

import MarkerClusterGroup from "react-leaflet-cluster";
import "./CSS/App.css";
import ButonC from "./butonC";

const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";
const MapComponent = ({
  mapCenter,
  data,
  mapRef,
}: {
  mapCenter: [number, number];
  data: any[]; // Consider typing this as Usluga[] if possible
  mapRef: React.RefObject<L.Map>; // Ref type without null
  children?: ReactNode;
}) => {
  const iconMapping: { [key: number]: string } = {
    17: vet,
    7: bolnicaslik,
    5: domslik,
    6: hitno,
    15: ljekarnaslik,
    16: ljekarnaslik,
    18: polislik,
    14: orto,
    3: prevencijaslik,
    8: psihoslik,
    4: obslik,
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
      mapRef.current.setView(new L.LatLng(lat, lng), 18);
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
        url={`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${apiKey}`}
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerClusterGroup
        maxClusterRadius={25}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={17}
      >
        {filteredData.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={L.icon({
              iconUrl:
                iconMapping[parseInt(location.kategorija[0])] ||
                "default_icon.png",
              iconSize: [40, 40],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(location.lat, location.lng, index),
            }}
            ref={(el) => (markersRef.current[index] = el)} // Correctly capturing the marker reference
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
      <ButonC />
    </MapContainer>
  );
};

export default MapComponent;
