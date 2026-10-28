import s from "@/styles/components/header/navigation.module.css";
import { useState } from "react";

export default function Navigation() {
  const [state, setState] = useState<"dishBox" | "stockBox" | undefined>(
    undefined,
  );

  return (
    <section>
      <div className={s.mainNav}>
        <button className="noBtn" onClick={() => setState("dishBox")}>
          dishBox
        </button>
        <button className="noBtn" onClick={() => setState("stockBox")}>
          stockBox
        </button>
      </div>
      <div>
        <div className={`${s.dropNav} ${state === "stockBox" ? s.active : ""}`}>
          <a href="/stockBox">Inventory</a>
          <a href="/request">Requests</a>
        </div>
        <div className={`${s.dropNav} ${state === "dishBox" ? s.active : ""}`}>
          <a href="/">Home</a>
          <a href="/dishbox">MyDishBox</a>
        </div>
      </div>
    </section>
  );
}
