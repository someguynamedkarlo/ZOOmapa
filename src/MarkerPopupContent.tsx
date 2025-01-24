import { Usluga } from "./Usluge";

type Props = {
    usluga: Usluga,
};

const MarkerPopupContent = ({usluga}: Props) => {
    const location = usluga;
    return (
        <>
            <h3>{location.imeUstanove}</h3>
            {location.adresa || "Adresa nije dostupna"}
            <br />
            {location.telefon || "Kontakt nije dostupan"}
            <br />
            { location.web.trim().length == 0 ||
                <h4>
                  <a
                    href={location.web}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Web stranica
                  </a>
                </h4>
            }
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
        </>
    )
}

export default MarkerPopupContent;