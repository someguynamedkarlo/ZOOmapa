import { useState } from "react";
import "./CSS/App.css"; // Make sure to import the CSS for the popup

const ButonC = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  const handleButtonClick = () => {
    setPopupVisible(true); // Show popup when button is clicked
  };

  const handleClosePopup = () => {
    setPopupVisible(false); // Hide popup when close button is clicked
  };

  return (
    <>
      <button className="bbb" onClick={handleButtonClick}>
        O karti
      </button>

      {/* Conditionally render popup */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <p>
              Interaktivnu mapu zdravstvenih usluga u Rijeci izradili su Luka
              Delak, Karlo Perić, Vanja Petropoli, Adrian Skomerža, Nancy
              Škibola, Jakov Tomasić i Mihael Host uz podršku Centra tehničke
              kulture Rijeka i Grada Rijeke.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ButonC;
