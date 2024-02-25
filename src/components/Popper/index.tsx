import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

function Popper({ children, id, anchorRef, open }: PopperInterface) {
  const popperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorRef.current && popperRef.current) {
      if (open) {
        const anchorPosition = anchorRef.current.getBoundingClientRect();

        popperRef.current.style.left = `${anchorPosition.left}px`;
        popperRef.current.style.top = `${
          anchorPosition.top + anchorPosition.height + 8
        }px`;

        popperRef.current.style.width = `${anchorPosition.width}px`;

        popperRef.current.style.visibility = "visible";
        popperRef.current.style.opacity = "1";
      } else {
        popperRef.current.style.visibility = "hidden";
        popperRef.current.style.opacity = "0";
      }
    }
  }, [open, children]);

  return (
    <div
      id={id}
      aria-hidden={open}
      ref={popperRef}
      className={styles.popperContainer}
    >
      {children}
    </div>
  );
}

export default Popper;
