import { ReactNode, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import L from "leaflet";

import ostaleusluge from "./icons/ostaleusluge.webp";
import podrskamladi from "./icons/podrskamladi.webp";
import podrskadjeca from "./icons/podrskadjeca.webp";
import prevencija2 from "./icons/prevencija2.webp";
import oboljeli from "./icons/oboljeli.webp";
import hitno from "./icons/hitno.webp";
import psihpomoc from "./icons/psihpomoc.webp";
import zene from "./icons/zene.webp";
import bolnica from "./icons/bolnica.webp";
import ortodont from "./icons/ortodont.webp";
import ljekarna from "./icons/ljekarna.webp";
import veterinari from "./icons/veterinari.webp";
import poli from "./icons/poli.webp";
import krv from "./icons/krv.webp";



import MarkerClusterGroup from "react-leaflet-cluster";
import "./CSS/App.css";
import "./CSS/gore.css";
import { Kategorija, Usluga } from "./Usluge";
import MarkerPopupOrList from "./MarkerPopupOrList";
import { debugConsoleLogStringify, DEFAULT_ZOOM, MAX_TILE_ZOOM, MAX_ZOOM, MIN_ZOOM } from "./constants";

// TODO: This shouldn't be here for safety reasons, but this is only a testing temporary key so I'll allow it
const apiKey = "b2c80386-e678-4ba5-b8c7-6a2e8829e987";

function getIconUrl(u: Usluga): string {
  switch (u.kategorija) {
    case Kategorija.ZDRAVSTVENO_OSIGURANJE: return ostaleusluge;
    case Kategorija.ZA_MLADE: return podrskamladi;
    case Kategorija.ZA_DJECU: return podrskadjeca;
    case Kategorija.PREVENCIJA: return prevencija2;
    case Kategorija.OBITELJSKA_MEDICINA: return oboljeli;
    case Kategorija.HITNA_POMOC: return hitno;
    case Kategorija.BOLNICE: return bolnica;
    case Kategorija.MENTALNO_ZDRAVLJE: return psihpomoc;
    case Kategorija.ZDRAVLJE_ZENA: return zene;
    case Kategorija.REHABILITACIJA: return bolnica;
    case Kategorija.STOMATOLOZI: return ortodont;
    case Kategorija.LJEKARNE_S_DEZURSTVIMA: return ljekarna;
    case Kategorija.LJEKARNE_BEZ_DEZURSTVA: return ljekarna;
    case Kategorija.VETERINARI: return veterinari;
    case Kategorija.PRIVATNICI: return poli;
    case Kategorija.DARIVANJE_KRVI: return krv;
  }
  debugConsoleLogStringify("getIconUrl error: ", u);
}

type Props = {
  mapCenter: [number, number];
  data: Usluga[]; // Consider typing this as Usluga[] if possible
  mapRef: React.RefObject<L.Map>; // Ref type without null
  children?: ReactNode;
  idToOpenPopup: number | null, 
  onMapClick: () => void;
}

const MapComponent = ({ mapCenter, data, mapRef, idToOpenPopup, onMapClick, children }: Props) => {
  const [filteredData, setFilteredData] = useState<Usluga[]>(data);
  const markersRef = useRef<any[]>([]);
  // Overwrite popup id when user clicks something else
  const [ignoreIdToOpenPopup, setIgnoreIdToOpenPopup] = useState<boolean>(false);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(mapCenter[0], mapCenter[1]), DEFAULT_ZOOM);
    }
  }, [mapCenter]);
  
  const openPopup = (id: number) => {
    // console.log("current: ", markersRef.current)
    if (markersRef.current) {
      // console.log("current[id]: ", markersRef.current[id])
      markersRef.current[id]?.openPopup();
    }
  }

  const handleMarkerClick = (lat: number, lng: number, id: number) => {
    setIgnoreIdToOpenPopup(true);
    if (mapRef.current) {
      mapRef.current.setView(new L.LatLng(lat, lng));
      openPopup(id);
    }
  };

  useEffect(() => {
    setIgnoreIdToOpenPopup(false);
    if (idToOpenPopup !== null) {
      openPopup(idToOpenPopup)
    }
  }, [idToOpenPopup])
  
  // Custom hook to handle map clicks
  const MapClickHandler = () => {
    useMapEvent("click", onMapClick);
    return null;
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
      <MapClickHandler />
      <TileLayer
        // TODO: use local tiles intead of stadiamaps
        url={`https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${apiKey}`}
        // url={`/tiles/{z}/{x}/tile_{z}_{x}_{y}.png`}
        attribution="&copy; OpenStreetMap contributors"
        maxNativeZoom={MAX_TILE_ZOOM} // Load tiles only up to this zoom level
        maxZoom={MAX_ZOOM}       // Allow users to zoom further
      />
      <MarkerClusterGroup
        maxClusterRadius={25}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={MAX_ZOOM}
      >
        {filteredData.map(location => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={L.icon({
              iconUrl: getIconUrl(location),
              iconSize: [40, 40],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(location.lat, location.lng, location.id),
            }}
            ref={(el) => {
              // Correctly capturing the marker reference
              if (el) {
                markersRef.current[location.id] = el;
                if (location.id === idToOpenPopup) {
                  openPopup(location.id);
                }
              }
            }}
          >
            <Popup minWidth={100}>
              <MarkerPopupOrList usluga={location} vidljiveUsluge={idToOpenPopup !== null && !ignoreIdToOpenPopup ? [location] : filteredData} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {children}
    </MapContainer>
  );
};

export default MapComponent;
