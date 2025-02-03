import { CSSProperties } from "react";
import { kategorijaKorisnikaToString, tipVlasnikaToString, trosakKorisnikaToString, Usluga } from "./Usluge";
import NewLineText from "./NewLineText";

type Props = {
    usluga: Usluga,
};

const MarkerPopupContent = ({usluga}: Props) => {
    const location = usluga;
    const allWebsites = usluga.web.trim().split('\n').filter(w => w.length > 0);
    const moreInfo = function() {
      let result = "";
      const tipVlasnika = usluga.javnoIliPrivatno === null ? null : tipVlasnikaToString(usluga.javnoIliPrivatno);
      const kategorijaKorisnika = usluga.kategorijaKorisnika === null ? null : kategorijaKorisnikaToString(usluga.kategorijaKorisnika);
      const trosakKorisnika = usluga.trosakKorisnika === null ? null : trosakKorisnikaToString(usluga.trosakKorisnika);
      if (trosakKorisnika !== null) {
        if (result !== "") {
          result += "\n";
        }
        result += "Cijena: " + trosakKorisnika;
      }
      if (kategorijaKorisnika !== null) {
        if (result !== "") {
          result += "\n";
        }
        result += "Korisnici usluge: " + kategorijaKorisnika;
      }
      if (tipVlasnika !== null) {
        if (result !== "") {
          result += "\n";
        }
        result += "Vlasnik ustanove: " + tipVlasnika;
      }
      return result;
    }();
    return (
        <div style={{ fontSize: 14 }}>
            <h3>{location.imeUstanove}</h3>
            <div>
              <h4 style={subtitleStyle}>Usluga:</h4>
              <NewLineText 
                text={location.nazivUsluge || "Vrsta usluge nepoznata"}
              />
            </div>
            { location.adresa !== "" &&
              <NewLineText 
                text={location.adresa}
              />
            }
            <br />
            <NewLineText 
              text={location.telefon || "Kontakt nije dostupan"}
            />
            <br />
            { moreInfo !== "" &&
              <>
                <NewLineText 
                  text={moreInfo}
                />
                <br />
              </>
            }
            { allWebsites.length === 0 ||
                allWebsites.map((w, i) => {
                  return (<h4 style={subtitleStyle} key={i}>
                    <a
                      href={w}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Web stranica { allWebsites.length > 1 ? i+1 : "" }
                    </a>
                  </h4>)
                })
            }
            <div>
              <h4 style={subtitleStyle}>Email:</h4>
              <NewLineText 
                text={location.email || "Email nije dostupan"}
              />
            </div>
            {
              location.opisUsluge !== "" &&
              <div>
                <h4 style={subtitleStyle}>Opis:</h4>
                <NewLineText 
                  text={location.opisUsluge}
                />
              </div>
            }
            { location.dodatneInfo !== "" &&
              <div>
                <br/>
                <NewLineText 
                  text={location.dodatneInfo}
                />
              </div>
            }
        </div>
    )
}

const subtitleStyle: CSSProperties = { fontWeight: "bold", fontSize: 14, marginTop: 12 };

export default MarkerPopupContent;