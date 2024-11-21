import { useState } from "react";
import "./menu.css";

interface DropdownProps {
  onFilterChange: (filters: string[]) => void;
}

function DropdownWithCheckboxes({ onFilterChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const options = [
    "Besplatne usluge",
    "Usluge s naplatom",
    "Bolnice",
    "Domovi zdravlja",
    "Ljekarne",
    "Poliklinike",
    "Prevencija ovisnosti",
    "Psiholozi",
  ];

  const handleCheckboxChange = (option: string) => {
    const updatedItems = selectedItems.includes(option)
      ? selectedItems.filter((item) => item !== option)
      : [...selectedItems, option];
    setSelectedItems(updatedItems);
    onFilterChange(updatedItems); // Notify the parent about the updated filters
  };

  return (
    <div className="dropdown-container">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedItems.length > 0
          ? `Odabrano (${selectedItems.length})`
          : "Filtriraj"}
        <span className="dropdown-icon">▼</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div key={option} className="dropdown-option">
              <input
                type="checkbox"
                id={option}
                checked={selectedItems.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                aria-labelledby={option}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownWithCheckboxes;
