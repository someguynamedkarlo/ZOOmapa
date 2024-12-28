import { useRef, useState } from "react";
import "./CSS/App.css";
import "./CSS/menu.css";

interface ScrollableMenuProps {
  onCategoryClick: (categoryLabel: string) => void;
}

function ScrollableMenu({ onCategoryClick }: ScrollableMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Mapping button labels to actual category values
  const categoryMappings: { [key: string]: string } = {
    "Hitno!": "HITNA MEDICINSKA POMOĆ",
    "Bolnice i ordinacije": "BOLNICE",
    Ljekarne: "LJEKARNE BEZ DEŽURSTAVA",
    Veterinari: "VETERINARI",
  };

  const scrollHorizontally = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      const itemWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth + 10
        : 0;

      const scrollAmount = direction === "left" ? -itemWidth : itemWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleButtonClick = (item: string) => {
    if (activeButton === item) {
      // Deselect if clicked again
      onCategoryClick(categoryMappings[item]);
      setActiveButton(null);
    } else {
      onCategoryClick(categoryMappings[item]);
      setActiveButton(item);
    }
  };

  return (
    <div className="scroll-stuff">
      <button
        className="scroll-arrow"
        onClick={() => scrollHorizontally("left")}
        aria-label="Scroll left"
      >
        &#8249;
      </button>
      <div className="scroll-container" ref={scrollContainerRef}>
        {Object.keys(categoryMappings).map((item) => (
          <button
            key={item}
            className={`scroll-item ${activeButton === item ? "active" : ""}`}
            onClick={() => handleButtonClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        className="scroll-arrow"
        onClick={() => scrollHorizontally("right")}
        aria-label="Scroll right"
      >
        &#8250;
      </button>
    </div>
  );
}

export default ScrollableMenu;
