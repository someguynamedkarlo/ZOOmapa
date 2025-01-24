import { CSSProperties } from "react";
import { Usluga } from "./Usluge";
import NewLineText from "./NewLineText";

type Props = {
    usluga: Usluga,
};

const MarkerPopupContent = ({usluga}: Props) => {
    const location = usluga;
    return (
        <div style={{ fontSize: 14 }}>
            <h3>{location.imeUstanove}</h3>
            <NewLineText 
              text={location.adresa || "Adresa nije dostupna"}
            />
            <br />
            <NewLineText 
              text={location.telefon || "Kontakt nije dostupan"}
            />
            <br />
            { location.web.trim().length == 0 ||
                <h4 style={subtitleStyle}>
                  <a
                    href={location.web}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Web stranica
                  </a>
                </h4>
            }
            <p>
              <h4 style={subtitleStyle}>Email:</h4>
              <NewLineText 
                text={location.email || "Email nije dostupan"}
              />
            </p>
            <p>
              <h4 style={subtitleStyle}>Opis:</h4>
              <NewLineText 
                text={location.opis || "Opis nije dostupan"}
              />
            </p>
            <p>
              <h4 style={subtitleStyle}>Preduvjeti:</h4>{" "}
              <NewLineText 
                text={location.preduvjeti || "Preduvjeti nisu dostupani"}
              />
            </p>
            <p>
              <h4 style={subtitleStyle}>Specifična usluga:</h4>{" "}
              <NewLineText 
                text={location.specUsluga || "Specifična usluga nije dostupna"}
              />
            </p>
            <p>
              <h4 style={subtitleStyle}>Radno vrijeme:</h4>{" "}
              <NewLineText 
                text={location.radnoVrijeme || "Radno vrijeme nije dostupno"}
              />
            </p>
        </div>
    )
}

const subtitleStyle: CSSProperties = { fontWeight: "bold", fontSize: 14 };

export default MarkerPopupContent;