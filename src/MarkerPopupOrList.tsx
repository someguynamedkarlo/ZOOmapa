import { useState } from "react";
import MarkerPopupContent from "./MarkerPopupContent";
import { Usluga } from "./Usluge";
import "./CSS/marker_popup.css"

type Props = {
    usluga: Usluga,
    vidljiveUsluge: Usluga[],
};

type isExpandedMap = {[key: number]: boolean};

function uslugeSuBlizu(a: Usluga, b: Usluga): boolean {
    const LAT_THRESHOLD = 0.0001;
    const LONG_THRESHOLD = 0.0001;
    return Math.abs(a.lat - b.lat) < LAT_THRESHOLD &&
        Math.abs(a.lng - b.lng) < LONG_THRESHOLD;
}

function createAllFalseMap(usluge: Usluga[]): isExpandedMap {
  const map: isExpandedMap = {};
  for (const u of usluge) {
    map[u.id] = false;
  }
  return map;
}

const MarkerPopupOrList = ({usluga, vidljiveUsluge}: Props) => {
    const prikaziOveUsluge = vidljiveUsluge.filter(u => uslugeSuBlizu(u, usluga));
    
    if (prikaziOveUsluge.length == 1) {
        return <MarkerPopupContent usluga={prikaziOveUsluge[0]} />
    }
    
    const [isExpanded, setExpanded] = useState<{[key: number]: boolean}>(createAllFalseMap(vidljiveUsluge));
    
    const toggleExpanded = (id: number) => {
      setExpanded(old => ({
        ...old, // Keep the rest of the state unchanged
        [id]: !old[id] // Toggle the value for the specific id
      }));
    };
    
    return (
    <div className="flex-column">
    {prikaziOveUsluge.map(u => (
      <div key={u.id} className="popup-list-section">
        <div
          className="popup-usluga-header"
          onClick={() => toggleExpanded(u.id)}
        >
          <span style={{ fontSize: 14 }}>{u.imeUstanove}</span>
          <i
            className={`fa fa-chevron-${isExpanded[u.id] ? "up" : "down"} category-icon`}
          />
        </div>
        { isExpanded[u.id] && <MarkerPopupContent usluga={u} /> }
      </div>
    ))}
    </div>);
}

export default MarkerPopupOrList;