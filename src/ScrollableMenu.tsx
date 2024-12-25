import { useRef } from "react";
import "./CSS/App.css";
import "./CSS/menu.css";
function ScrollableMenu() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollHorizontally = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      // Calculate the width of a single item
      const itemWidth = container.firstElementChild
        ? (container.firstElementChild as HTMLElement).offsetWidth + 10 // Include gap
        : 0;

      // Scroll by one item's width
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
        &#8249; {/* Left arrow */}
      </button>
      <div className="scroll-container" ref={scrollContainerRef}>
        {/* Replace these with your actual items */}
        <div className="scroll-item">Hitno!</div>
        <div className="scroll-item">Bolnice i ordinacije</div>
        <div className="scroll-item">Ljekarne</div>
        <div className="scroll-item">Veterinari</div>
        <div className="scroll-item">Druge usluge</div>
      </div>
      <button
        className="scroll-arrow"
        onClick={() => scrollHorizontally("right")}
        aria-label="Scroll right"
      >
        &#8250; {/* Right arrow */}
      </button>
    </div>
  );
}

export default ScrollableMenu;
