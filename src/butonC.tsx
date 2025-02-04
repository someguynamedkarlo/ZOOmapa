import "./CSS/App.css";
import "./CSS/gore.css";
import infoIcon from "./icons/info.webp"

type Props = {
  oKartiPopupVisible: boolean;
  setOKartiPopupVisible: (visible: boolean) => void;
}

const ButonC = ({oKartiPopupVisible, setOKartiPopupVisible}: Props) => {

  const handleButtonClick = () => {
    setOKartiPopupVisible(true); // Show popup when button is clicked
  };

  const handleClosePopup = () => {
    setOKartiPopupVisible(false); // Hide popup when close button is clicked
  };

  return (
    <>
      <button className="bbb" onClick={handleButtonClick}>
        <img src={infoIcon} style={{ width: "100%", height: "100%" }} />
      </button>

      {/* Conditionally render popup */}
      {oKartiPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <div className="close" onClick={handleClosePopup}>
              &times;
            </div>
            <p className="popup-text-content">
              Interaktivnu mapu zdravstvenih usluga u Rijeci izradili su Luka
              Delak, Mihael Host, Karlo Perić, Vanja Petropoli, Adrian Skomerža, Nancy
              Škibola i Jakov Tomasić uz podršku Centra tehničke
              kulture Rijeka i Grada Rijeke.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ButonC;
