import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

import styles from "./styles.module.css";

function Chip({ label, onDelete }: ChipProps) {
  return (
    <div className={styles.chip}>
      <span>{label}</span>
      {onDelete && (
        <div
          className={styles.deleteButton}
          onClick={(ev) => {
            ev.stopPropagation();
            onDelete();
          }}
        >
          <FontAwesomeIcon
            icon={faX}
            style={{ fontSize: 8 }}
            alignmentBaseline="central"
          />
        </div>
      )}
    </div>
  );
}

export default Chip;
