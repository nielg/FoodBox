import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";

import styles from "@/styles/components/carrousel.module.css";

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 2;
const MARGIN_PX = 2;

interface ThumbnailsProps {
  items: string[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

function Thumbnails({ items, index, setIndex }: ThumbnailsProps) {
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = thumbnailsRef.current;

    if (!container) return;

    let scrollPosition = 0;

    for (let i = 0; i < index; i++) {
      scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
    }

    scrollPosition += MARGIN_PX;

    const containerWidth = container.offsetWidth;
    const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;

    scrollPosition -= centerOffset;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }, [index]);

  return (
    <div ref={thumbnailsRef} className={styles.thumbnailsContainer}>
      <div className={styles.thumbnails}>
        {items.map((item, i) => (
          <motion.button
            key={`carousel-thumbnail-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                marginLeft: MARGIN_PX,
                marginRight: MARGIN_PX,
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                marginLeft: 0,
                marginRight: 0,
              },
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className={styles.thumbnail}
          >
            <img src={item} alt="Image thumbnail" draggable={false} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

interface CarouselProps {
  items: string[];
}

export default function Carousel({ items }: CarouselProps) {
  const [index, setIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue<number>(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!isDragging && container) {
      const containerWidth = container.offsetWidth || 1;

      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, isDragging]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);

    const containerWidth = containerRef.current?.offsetWidth || 1;

    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let newIndex = index;

    if (Math.abs(velocity) > 500) {
      newIndex = velocity > 0 ? index - 1 : index + 1;
    } else if (Math.abs(offset) > containerWidth * 0.3) {
      newIndex = offset > 0 ? index - 1 : index + 1;
    }

    newIndex = Math.max(0, Math.min(items.length - 1, newIndex));

    setIndex(newIndex);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {/* Main Carousel */}
        <div ref={containerRef} className={styles.container}>
          <motion.div
            className={styles.track}
            drag="x"
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ x }}
          >
            {items.map((item, i) => (
              <div key={`carousel-item-${i}`} className={styles.slide}>
                <img src={item} alt="Carousel item" draggable={false} />
              </div>
            ))}
          </motion.div>

          {/* Previous */}
          <motion.button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`${styles.button} ${styles.buttonPrevious} ${
              index === 0 ? styles.buttonDisabled : ""
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Next */}
          <motion.button
            type="button"
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`${styles.button} ${styles.buttonNext} ${
              index === items.length - 1 ? styles.buttonDisabled : ""
            }`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Counter */}
          <div className={styles.counter}>
            {index + 1} / {items.length}
          </div>
        </div>

        {/* Thumbnails */}
        <Thumbnails items={items} index={index} setIndex={setIndex} />
      </div>
    </div>
  );
}
