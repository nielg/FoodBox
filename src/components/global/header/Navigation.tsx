import s from "@/styles/components/header/navigation.module.css";
import { useEffect, useRef, useState } from "react";

export default function Navigation() {
  const [activeNav, setActiveNav] = useState<"dishBox" | "stockBox">();
  const [arrowLeft, setArrowLeft] = useState<number>();
  const subnavRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<
    Record<"dishBox" | "stockBox", HTMLButtonElement | null>
  >({
    dishBox: null,
    stockBox: null,
  });

  useEffect(() => {
    if (!activeNav) return;

    const updateArrowPosition = () => {
      const button = buttonRefs.current[activeNav];
      const subnav = subnavRef.current;
      if (!button || !subnav) return;

      const buttonRect = button.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      setArrowLeft(buttonCenter - subnav.getBoundingClientRect().left);
    };

    updateArrowPosition();
    window.addEventListener("resize", updateArrowPosition);
    return () => window.removeEventListener("resize", updateArrowPosition);
  }, [activeNav]);

  return (
    <section className={s.navigation}>
      <div className={s.mainNav}>
        <button
          className="noBtn"
          onClick={() => setActiveNav("dishBox")}
          ref={(element) => {
            buttonRefs.current.dishBox = element;
          }}
          aria-expanded={activeNav === "dishBox"}
          aria-controls="dishbox-subnav"
        >
          dishBox
        </button>
        <button
          className="noBtn"
          onClick={() => setActiveNav("stockBox")}
          ref={(element) => {
            buttonRefs.current.stockBox = element;
          }}
          aria-expanded={activeNav === "stockBox"}
          aria-controls="stockbox-subnav"
        >
          stockBox
        </button>
      </div>

      {activeNav && (
        <div
          className={s.dropNav}
          id={activeNav === "dishBox" ? "dishbox-subnav" : "stockbox-subnav"}
          ref={subnavRef}
        >
          <span
            className={s.arrow}
            style={{ left: arrowLeft ?? "50%" }}
            aria-hidden="true"
          />
          {activeNav === "dishBox" ? (
            <>
              <a href="/">Home</a>
              <a href="/dishBox">MyDishBox</a>
            </>
          ) : (
            <>
              <a href="/stockBox">Inventory</a>
              <a href="/stockBox/request">Requests</a>
            </>
          )}
        </div>
      )}
    </section>
  );
}
