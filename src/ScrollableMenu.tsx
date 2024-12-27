import { useRef } from "react";
import "./CSS/App.css";
import "./CSS/menu.css";

interface ScrollableMenuProps {
  onCategoryClick: (categoryLabel: string) => void;
}

function ScrollableMenu({ onCategoryClick }: ScrollableMenuProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Mapping button labels to actual category values
  const categoryMappings: { [key: string]: string } = {
    "Hitno!": "HITNA MEDICINSKA POMOĆ",
    "Bolnice i ordinacije": "BOLNICE",
    Ljekarne: "LJEKARNE S DEŽURSTVIMA",
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
            className="scroll-item"
            onClick={() => onCategoryClick(categoryMappings[item])} // Pass the correct label
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
