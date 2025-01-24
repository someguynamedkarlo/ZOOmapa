import { useState } from "react";
import MarkerPopupContent from "./MarkerPopupContent";
import { Usluga } from "./Usluge";
import "./CSS/marker_popup.css"

type Props = {
    usluga: Usluga,
    vidljiveUsluge: Usluga[],
};

function uslugeSuBlizu(a: Usluga, b: Usluga): boolean {
    const LAT_THRESHOLD = 0.0001;
    const LONG_THRESHOLD = 0.0001;
    return Math.abs(a.lat - b.lat) < LAT_THRESHOLD &&
        Math.abs(a.lng - b.lng) < LONG_THRESHOLD;
}

const MarkerPopupOrList = ({usluga, vidljiveUsluge}: Props) => {
    const prikaziOveUsluge = vidljiveUsluge.filter(u => uslugeSuBlizu(u, usluga));
    
    if (prikaziOveUsluge.length == 1) {
        return <MarkerPopupContent usluga={prikaziOveUsluge[0]} />
    }
    
    const [isExpanded, setExpanded] = useState<boolean[]>(prikaziOveUsluge.map(() => false));
    
    const toggleExpanded = (index: number) => {
        setExpanded(old => old.map((e, i) => i === index ? !e : e));
    };
    
    return (
    <div className="flex-column">
    {prikaziOveUsluge.map((u, index) => (
      <div key={index} className="popup-list-section">
        <div
          className="popup-usluga-header"
          onClick={() => toggleExpanded(index)}
        >
          <span style={{ fontSize: 14 }}>{u.imeUstanove}</span>
          <i
            className={`fa fa-chevron-${isExpanded[index] ? "up" : "down"} category-icon`}
          />
        </div>
        { isExpanded[index] && <MarkerPopupContent usluga={u} /> }
      </div>
    ))}
    </div>);
}

export default MarkerPopupOrList;