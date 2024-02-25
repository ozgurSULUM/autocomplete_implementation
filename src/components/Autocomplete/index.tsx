import {
  KeyboardEvent,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import Chip from "/src/components/Chip";
import Popper from "/src/components/Popper";

import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "../LinearProgress";

function Autocomplete<T>(props: AutocompleteProps<T>) {
  // Default Props and function definitions - start
  const {
    value,
    options = [],
    inputValue,
    multiple,
    onInputValueChange,
    onClose,
    onChange,
    isOptionEqualToValue = defaultIsOptionEqualToValue,
    getOptionLabel = defaultGetOptionLabel,
    keyboardActionsThrottle = 50,
    isLoading = false,
    isUninitialized,
    isEmpty,
    inputId,
    ...otherProps
  } = props;

  const [innerValue, setInnerValue] =
    useState<AutocompleteProps<T>["value"]>(value);
  const [innerInputValue, setInnerInputValue] = useState<string>(
    inputValue || ""
  );

  const handleDelete = useMemo(() => {
    if (multiple) {
      return (deletedValue: T) => {
        setInnerValue((prevValue) => {
          const newValues = (prevValue as T[]).filter(
            (val) => !isOptionEqualToValue(deletedValue, val)
          );

          onChange && onChange(newValues);

          return newValues;
        });
      };
    } else {
      return () => {
        setInnerValue(null);
        onChange && onChange(null);
      };
    }
  }, [multiple]);

  const defaultRenderTags = useCallback(
    (values: T[]) => {
      return values.map((value, index) => (
        <Chip
          key={`${getOptionLabel(value)}_${index}`}
          label={getOptionLabel(value)}
          onDelete={handleDelete ? () => handleDelete(value) : undefined}
        />
      ));
    },
    [getOptionLabel, handleDelete]
  );

  const defaultRenderOption = useCallback(
    (option: T, isSelected: boolean, props: RenderOptionProps) => {
      return (
        <li {...props}>
          {multiple && <input readOnly type="checkbox" checked={isSelected} />}
          {getOptionLabel(option)}
        </li>
      );
    },
    [getOptionLabel, multiple]
  );

  const { renderTags = defaultRenderTags, renderOption = defaultRenderOption } =
    otherProps;
  // Default Props and function definitions - end

  // check if option is selected function
  const isOptionSelected = (option: T) => {
    return multiple
      ? (innerValue as T[]).some((val) => isOptionEqualToValue(option, val))
      : isOptionEqualToValue(option, innerValue as T);
  };

  const ariaId = useId(); // runtime unique id for aria labels and autocomplete ids
  const anchorRef = useRef<HTMLDivElement>(null); // autocomplete popper ref
  const inputRef = useRef<HTMLInputElement>(null); // autocomplete input ref
  const clickContainerRef = useRef<HTMLDivElement>(null); // click container div ref for clickaway listener
  const keyboardActionId = useRef<number | null>(null); // timeout id for keyboard actions throttle
  const selectedItemOptionsIndexArr = useRef(new Set<number>());
  const [activeItemIndex, setActiveItemIndex] = useState(-1); // track active option state
  const [disableItemHover, setDisableItemHover] = useState(false); // disable mouse hover when using keybord navigation state
  const [open, setOpen] = useState<boolean>(false); // options list open closed state

  // Pretty basic change value if inner value changes
  useEffect(() => {
    onChange && onChange(innerValue as any);
  }, [innerValue]);

  // get id functions
  const getListItemId = (index: number) => `list-item-${ariaId}-${index}`;
  const getAutocompletePopupId = () => `autocomplete-popper-${ariaId}`;
  const getAutocompleteInputId = () => `autocomplete-input-${ariaId}`;

  // scrollIntoViewIfNeeded is not a standart so I have to write this myself.
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoViewIfNeeded
  const scrollOptionIntoViewIfNeeded = (index: number, alignToTop: boolean) => {
    const optionId = getListItemId(index);
    const popupId = getAutocompletePopupId();

    const optionEl = document.getElementById(optionId);
    const popperEl = document.getElementById(popupId);

    if (anchorRef.current && optionEl && popperEl && onInputValueChange) {
      const popperScrollTopPosition = popperEl.scrollTop;
      const popperPosition = popperEl.getBoundingClientRect();
      const optionPosition = optionEl.getBoundingClientRect();

      const optionBottomTopPosition = alignToTop
        ? optionEl.offsetTop - optionPosition.height
        : optionEl.offsetTop + optionPosition.height;

      const popperScrollWindowPositions = {
        top: popperScrollTopPosition,
        bottom: popperScrollTopPosition + popperPosition.height,
      };

      if (
        optionBottomTopPosition < popperScrollWindowPositions.top ||
        optionBottomTopPosition > popperScrollWindowPositions.bottom
      ) {
        optionEl?.scrollIntoView(alignToTop);
      }
    }
  };

  // Scrolls to first selected item if it is not in view
  useEffect(() => {
    if (open) {
      let firstIndex = Number.MAX_SAFE_INTEGER;

      selectedItemOptionsIndexArr.current.forEach((index) => {
        if (index < firstIndex) {
          firstIndex = index;
        }
      });

      scrollOptionIntoViewIfNeeded(
        selectedItemOptionsIndexArr.current.size > 0 ? firstIndex : 0,
        true
      );
    } else {
      setActiveItemIndex(-1);
    }
  }, [open]);

  // Click away functions - start
  const onClickAway = () => {
    setOpen(false);
    onClose && onClose();

    // If single select set inner input value to selected value label
    if (!multiple && value) {
      const optionLabel = getOptionLabel(value);
      setInnerInputValue(optionLabel);
    }
  };

  const keepInputFocus = () => {
    inputRef.current?.focus();
  };

  const handleClickAway = (e: MouseEvent) => {
    if (clickContainerRef.current?.contains(e.target as Node)) {
      keepInputFocus();
      return;
    }

    onClickAway();
  };

  useEffect(() => {
    window.addEventListener("click", handleClickAway, true);

    return () => {
      window.removeEventListener("click", handleClickAway, true);
    };
  }, [value, multiple]);
  // Click away functions - end

  // Keyboard action functions - start
  // delete on backspace function
  const backspaceKeyInteraction = (ev: KeyboardEvent<HTMLInputElement>) => {
    console.log("ev", ev);
    if (multiple) {
      if (ev && ev.code === "Backspace" && innerInputValue === "") {
        setInnerValue((prevValue) => {
          const newOptions = [...(prevValue as T[])];
          newOptions.pop();

          onChange && onChange(newOptions);
          return newOptions;
        });
      }
    } else {
      if (ev && ev.code === "Backspace" && innerInputValue === "") {
        setInnerValue(null);
        onChange && onChange(null);
      }
    }
  };

  // General accesibility actions with keyboard function
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/combobox_role#keyboard_interactions
  const GeneralKeyboardInteractions = (ev: KeyboardEvent<HTMLInputElement>) => {
    switch (ev.code) {
      case "ArrowDown":
        if (ev.altKey) {
          setOpen(true);
        } else {
          setDisableItemHover(true);
          setActiveItemIndex((prev) => {
            let newActiveItemIndex;
            if (prev + 1 < options.length && (prev >= 0 || prev === -1)) {
              newActiveItemIndex = prev + 1;
            } else {
              newActiveItemIndex = 0;
            }

            scrollOptionIntoViewIfNeeded(newActiveItemIndex, false);
            return newActiveItemIndex;
          });
        }

        break;

      case "ArrowUp":
        if (ev.altKey) {
          setOpen(false);
        }
        {
          setDisableItemHover(true);
          setActiveItemIndex((prev) => {
            let newActiveItemIndex;
            if (prev - 1 >= 0) {
              newActiveItemIndex = prev - 1;
            } else {
              newActiveItemIndex = options.length - 1;
            }

            scrollOptionIntoViewIfNeeded(newActiveItemIndex, true);
            return newActiveItemIndex;
          });
        }
        break;

      case "Enter":
        getSelectHandler()(options[activeItemIndex], activeItemIndex);
        break;

      case "Backspace":
        backspaceKeyInteraction(ev);
        break;
    }
  };

  // Keyboard event handler we use below keyboard action functions here
  // We throttle keyboard actions by {keyboardActionsThrottle} ms
  const onInputKeyDownCapture: KeyboardEventHandler<HTMLInputElement> =
    useMemo(() => {
      return (ev) => {
        if (!keyboardActionId.current) {
          keyboardActionId.current = setTimeout(() => {
            GeneralKeyboardInteractions(ev);

            keyboardActionId.current = null;
          }, keyboardActionsThrottle);
        }
      };
    }, [multiple, backspaceKeyInteraction, GeneralKeyboardInteractions]);
  // Keyboard action functions - end

  // Option render related functions - start
  // returns select function for list items
  const getSelectHandler = () => {
    if (multiple) {
      return (option: T, optionIndex: number) => {
        setInnerValue((prevInnerValue) => {
          let selectedItemValuesIndex: number | undefined;

          const isSelected = (prevInnerValue as T[]).some((val, index) => {
            const isSelected = isOptionEqualToValue(option, val);
            if (isSelected) {
              selectedItemValuesIndex = index;
            }

            return isSelected;
          });

          if (isSelected) {
            const newValue = [...(prevInnerValue as T[])];
            newValue.splice(selectedItemValuesIndex as number, 1);

            selectedItemOptionsIndexArr.current.delete(optionIndex);
            return newValue;
          } else {
            const newValue = [...(prevInnerValue as T[])];
            newValue.push(option);

            selectedItemOptionsIndexArr.current.add(optionIndex);
            return newValue;
          }
        });
      };
    } else {
      return (option: T, optionIndex: number) => {
        setInnerValue((prevInnerValue) => {
          if (isOptionEqualToValue(option, prevInnerValue as T)) {
            selectedItemOptionsIndexArr.current.clear();
            setInnerInputValue("");
            return null;
          } else {
            selectedItemOptionsIndexArr.current.clear();
            selectedItemOptionsIndexArr.current.add(optionIndex);
            setInnerInputValue(getOptionLabel(option));
            return option;
          }
        });
      };
    }
  };

  // returns list item props for renderOption function
  const getOptionProps = (option: T, index: number) => ({
    onClick: () => getSelectHandler()(option, index),
    onMouseMove: () => {
      setActiveItemIndex(index);
      setDisableItemHover(false);
    },
    "data-selected": isOptionSelected(option),
    role: "option",
    className: `${styles.autocompleteListItem} ${
      disableItemHover ? "" : styles.autocompleteListItemHover
    }
    ${index === activeItemIndex ? styles.active : ""}`,
    key: `${getOptionLabel(option)}_${index}`,
    id: getListItemId(index),
  });

  // renders list of options
  const listOfOptions = () => {
    return options.map((option, index) =>
      renderOption(
        option,
        isOptionSelected(option),
        getOptionProps(option, index)
      )
    );
  };
  // Option render related functions - end

  console.log("isUninitialized", isUninitialized);
  console.log("isEmpty", isEmpty);

  return (
    <div ref={clickContainerRef} onClick={() => setOpen(true)}>
      <div
        ref={anchorRef}
        onClick={keepInputFocus}
        className={styles.autocompleteInputContainer}
      >
        <div className={styles.autocompleteInputContentArea}>
          {multiple && renderTags(value)}
          <input
            ref={inputRef}
            value={innerInputValue}
            onChange={(ev) => {
              onInputValueChange && onInputValueChange(ev.target.value || "");
              setInnerInputValue(ev.target.value || "");
            }}
            style={{ width: multiple ? `${innerInputValue.length}ch` : "100%" }}
            onKeyDownCapture={onInputKeyDownCapture}
            id={inputId || getAutocompleteInputId()}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-controls={`autocomplete-suggestions-${ariaId}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-activedescendant=""
          />
        </div>
        <button
          data-open={open}
          className={styles.autocompleteDropdownIconButton}
          onClick={(ev) => {
            ev.stopPropagation();
            setOpen((prev) => {
              if (!prev) onClose && onClose();

              return !prev;
            });
          }}
        >
          <FontAwesomeIcon
            className={styles.autocompleteDropdownIcon}
            icon={faCaretDown}
          />
        </button>
      </div>
      <Popper id={getAutocompletePopupId()} open={open} anchorRef={anchorRef}>
        {!isEmpty ? (
          <ul
            id={`autocomplete-suggestions-${ariaId}`}
            role="listbox"
            data-multiple={multiple}
            className={styles.autocompleteList}
          >
            {isLoading && <LinearProgress />}
            {listOfOptions()}
          </ul>
        ) : (
          <div className={styles.autocompleteInfoMessage}>
            {isLoading && <LinearProgress />}
            {isUninitialized
              ? "please search for a character"
              : "no character found"}
          </div>
        )}
      </Popper>
    </div>
  );
}

const defaultIsOptionEqualToValue = <T,>(option: T, value: T | null) => {
  if (!value) return false;
  return option === value;
};

const defaultGetOptionLabel = <T,>(option: T): string => {
  if (typeof option === "string") {
    return option;
  }

  return "please provide getOptionLabel method";
};

export default Autocomplete;
