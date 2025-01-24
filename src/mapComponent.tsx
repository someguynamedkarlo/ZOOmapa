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
import vet from "./icons/veterinari.webp";
import podrška from "./icons/podrška.webp"
import zene from "./icons/zene.webp"
import psihpomoc from "./icons/psihpomoc.webp"
import usmladi from "./icons/podrskamladi.webp"
import usdjeca from "./icons/podrskadjeca.webp"
import ostalo from "./icons/ostaleusluge.webp"
import nekategorizirano from "./icons/nekategorizirano.webp"
import oboljeli from "./icons/oboljeli.webp"

import MarkerClusterGroup from "react-leaflet-cluster";
import "./CSS/App.css";
import "./CSS/gore.css";
import ButonC from "./butonC";
import { Usluga } from "./Usluge";
import MarkerPopupOrList from "./MarkerPopupOrList";

const DEFAULT_ZOOM = 14;
const MIN_ZOOM = 11;
const MAX_ZOOM = 18;
const MAX_TILE_ZOOM = 16; // Max zoom for requesting new tiles. All zooms greater that this will look more and more blurry

// This should be here for safety reasons, but this is only a testing temporary key so I'll allow it
const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";

const MapComponent = ({
  mapCenter,
  data,
  mapRef,
}: {
  mapCenter: [number, number];
  data: Usluga[]; // Consider typing this as Usluga[] if possible
  mapRef: React.RefObject<L.Map>; // Ref type without null
  children?: ReactNode;
}) => {
  const iconMapping: { [key: number]: string } = {
    13: oboljeli,
    19: nekategorizirano,
    10: ostalo,
    1: usmladi,
    2: usdjeca,
    9: psihpomoc,
    12: zene,
    11: podrška,
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
  const [filteredData, setFilteredData] = useState<Usluga[]>(data);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(mapCenter[0], mapCenter[1]), DEFAULT_ZOOM);
    }
  }, [mapCenter]);

  const handleMarkerClick = (lat: number, lng: number, index: number) => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng));
      markersRef.current[index].openPopup();
    }
  };

  return (
    <MapContainer
      style={{ height: "100%", width: "100%" }}
      center={mapCenter}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      scrollWheelZoom={true}
      ref={mapRef} // Corrected ref type
      zoomControl={false}
    >
      <TileLayer
        url={`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${apiKey}`}
        attribution="&copy; OpenStreetMap contributors"
        maxNativeZoom={MAX_TILE_ZOOM} // Load tiles only up to this zoom level
        maxZoom={MAX_ZOOM}       // Allow users to zoom further
      />
      <MarkerClusterGroup
        maxClusterRadius={25}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={MAX_ZOOM}
      >
        {filteredData.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={L.icon({
              iconUrl:
                iconMapping[location.kategorija[0]] ||
                "default_icon.png",
              iconSize: [40, 40],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(location.lat, location.lng, index),
            }}
            ref={(el) => (markersRef.current[index] = el)} // Correctly capturing the marker reference
          >
            <Popup minWidth={100}>
              <MarkerPopupOrList usluga={location} vidljiveUsluge={filteredData} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <ButonC />
    </MapContainer>
  );
};

export default MapComponent;
