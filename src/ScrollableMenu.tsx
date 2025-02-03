import { useRef, useState } from "react";
import "./CSS/App.css";
import "./CSS/menu.css";
import "./CSS/gore.css";
import { AllQuickFilterValues, QuickFilter, quickFilterToString } from "./Filter";

interface ScrollableMenuProps {
  onQuickFilterClick: (quickFilter: QuickFilter | null) => void;
}

function ScrollableMenu({ onQuickFilterClick }: ScrollableMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeButton, setActiveButton] = useState<QuickFilter | null>(null);

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

  const handleButtonClick = (item: QuickFilter) => {
    if (activeButton === item) {
      // Deselect if clicked again
      onQuickFilterClick(null);
      setActiveButton(null);
    } else {
      onQuickFilterClick(item);
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
        {AllQuickFilterValues.map((item) => (
          <button
            key={item}
            className={`scroll-item ${activeButton === item ? "active" : ""}`}
            onClick={() => handleButtonClick(item)}
          >
            {quickFilterToString(item)}
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
