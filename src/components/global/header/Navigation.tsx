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
    if (!activeNav) {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/dishBox")) {
        setActiveNav("dishBox");
      } else if (pathname.startsWith("/stockBox")) {
        setActiveNav("stockBox");
      } else {
        setActiveNav("dishBox");
      }
    }

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

      <div
        className={s.dropNav}
        id={activeNav === "dishBox" ? "dishbox-subnav" : "stockbox-subnav"}
        ref={subnavRef}
      >
        <svg
          className={s.arrow}
          style={{ left: arrowLeft ?? "50%" }}
          viewBox="0 0 24 16"
          aria-hidden="true"
        >
          <path d="M2 16Q0 16 1.2 14.2L10.3 2Q12 0 13.7 2L22.8 14.2Q24 16 22 16Z" />
        </svg>
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
    </section>
  );
}
