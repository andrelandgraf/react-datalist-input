import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';

import useStateRef from './useStateRef';

import './DataListInput.css';

/**
   * default function for matching the current input value (needle)
   * and the values of the items array
   * @param currentInput
   * @param item
   * @returns {boolean}
   */
const labelMatch = (currentInput, item) => item
  .label.substr(0, currentInput.length).toLowerCase() === currentInput.toLowerCase();

/**
   * function for getting the index of the currentValue inside a value of the values array
   * @param currentInput
   * @param item
   * @returns {number}
   */
const indexOfMatch = (currentInput, item) => item
  .label.toLowerCase().indexOf(currentInput.toLowerCase());

/**
   * index of item in items
   * @param {*} item
   * @param {*} items
   */
const indexOfItem = (item, items) => items
  .indexOf(items.find(i => i.key === item.key));

const DataListInput = ({
  activeItemClassName,
  clearInputOnSelect,
  debounceLoader,
  debounceTime,
  dropdownClassName,
  dropDownLength,
  initialValue,
  inputClassName,
  itemClassName,
  match,
  onDropdownClose,
  onDropdownOpen,
  onInput,
  onSelect,
  placeholder,
  requiredInputLength,
  suppressReselect,
  items,
}) => {
  /*  last valid item that was selected from the drop down menu */
  const [lastValidItem, setLastValidItem] = useState();
  /* current input text */
  const [currentInput, setCurrentInput, currentInputRef] = useStateRef(initialValue);
  /* current set of matching items */
  const [matchingItems, setMatchingItems] = useState([]);
  /* visibility property of the drop down menu */
  const [visible, setVisible, visibleRef] = useStateRef(false);
  /* index of the currently focused item in the drop down menu */
  const [focusIndex, setFocusIndex] = useState(0);
  /* cleaner click events, click interaction within dropdown menu */
  const interactionHappenedRef = useRef(false);
  /* show loader if still matching in debounced mode */
  const [isMatchingDebounced, setIsMatchingDebounced] = useState(false);

  /* to manage debouncing of matching, typing input into the input field */
  const inputHappenedTimeout = useRef();
  const menu = useRef();
  const inputField = useRef();

  useEffect(() => {
    const onClickCloseMenu = (event) => {
      if (!menu.current) return;
      // if rerender, items inside might change, allow one click without further checking
      if (interactionHappenedRef.current) {
        interactionHappenedRef.current = false;
        return;
      }
      // do not do anything if input is clicked, as we have a dedicated func for that
      if (!inputField.current) return;
      const targetIsInput = event.target === inputField.current;
      const targetInInput = inputField.current.contains(event.target);
      if (targetIsInput || targetInInput) return;

      // do not close menu if user clicked inside
      const targetInMenu = menu.current.contains(event.target);
      const targetIsMenu = event.target === menu.current;
      if (targetInMenu || targetIsMenu) return;

      if (visibleRef.current) {
        setVisible(false);
        setFocusIndex(-1);
        onDropdownClose();
      }
    };
    window.addEventListener('click', onClickCloseMenu, false);
    console.log('added event listener');
    return () => {
      window.removeEventListener('click', onClickCloseMenu);
    };
  }, [onDropdownClose]);

  useEffect(() => {
    // if we have an initialValue, we want to reset it everytime we update and are empty
    // also setting a new initialValue will trigger this
    if (!currentInput && initialValue && !visible && !isMatchingDebounced) {
      setCurrentInput(initialValue);
    }
  }, [currentInput, visible, isMatchingDebounced, initialValue]);

  /**
     * runs the matching process of the current input
     * and handles debouncing the different callback calls to reduce lag time
     * for bigger datasets or heavier matching algorithms
     * @param nextInput
     */
  const debouncedMatchingUpdateStep = useCallback((nextInput) => {
    // cleanup waiting update step
    if (inputHappenedTimeout.current) {
      clearTimeout(inputHappenedTimeout.current);
      inputHappenedTimeout.current = null;
    }

    // set nextInput into input field and show loading if debounced mode is on
    const reachedRequiredLength = nextInput.length >= requiredInputLength;
    const showMatchingStillLoading = debounceTime >= 0 && reachedRequiredLength;
    setCurrentInput(nextInput);
    setIsMatchingDebounced(showMatchingStillLoading);
    // no matching if we do not reach required input length
    if (!reachedRequiredLength) return;

    const updateMatchingItems = () => {
      // matching process to find matching entries in items array
      const updatedMatchingItems = items.filter((item) => {
        if (typeof (match) === typeof (Function)) return match(nextInput, item);
        return labelMatch(nextInput, item);
      });
      const displayableItems = updatedMatchingItems.slice(0, dropDownLength);
      const showDragIndex = lastValidItem && !clearInputOnSelect;
      const index = showDragIndex ? indexOfItem(lastValidItem, displayableItems) : 0;
      if (displayableItems.length) {
        setMatchingItems(displayableItems);
        setFocusIndex(index > 0 ? index : 0);
        setIsMatchingDebounced(false);
        setVisible(true);
        onDropdownOpen();
      } else {
        if (visibleRef.current) {
          setVisible(false);
          onDropdownClose();
        }
        setMatchingItems(displayableItems);
        setFocusIndex(-1);
        setIsMatchingDebounced(false);
      }
    };

    if (debounceTime <= 0) {
      updateMatchingItems();
    } else {
      inputHappenedTimeout.current = setTimeout(updateMatchingItems, debounceTime);
    }
  }, [requiredInputLength, debounceTime, match, items,
    dropDownLength, lastValidItem, clearInputOnSelect,
    onDropdownOpen, onDropdownClose]);

  /**
     * gets called when someone starts to write in the input field
     * @param value
     */
  const onHandleInput = useCallback((event) => {
    const { value } = event.target;
    debouncedMatchingUpdateStep(value);
    onInput(value);
  }, [debouncedMatchingUpdateStep, onInput]);

  const onClickInput = useCallback(() => {
    let value = currentInputRef.current;
    // if user clicks on input field with initialValue,
    // the user most likely wants to clear the input field
    if (initialValue && value === initialValue) {
      value = '';
    }

    const reachedRequiredLength = value.length >= requiredInputLength;
    if (reachedRequiredLength && !visibleRef.current) {
      debouncedMatchingUpdateStep(value);
    }
  }, [requiredInputLength, initialValue, debouncedMatchingUpdateStep]);

  /**
     * handleSelect is called onClickItem and onEnter upon an option of the drop down menu
     * does nothing if the key has not changed since the last onSelect event
     * @param selectedItem
     */
  const onHandleSelect = useCallback((selectedItem) => {
    // block select call until last matching went through
    if (isMatchingDebounced) return;

    setCurrentInput(clearInputOnSelect ? '' : selectedItem.label);
    setVisible(false);
    setFocusIndex(-1);
    interactionHappenedRef.current = true;
    onDropdownClose();

    if (suppressReselect && lastValidItem && selectedItem.key === lastValidItem.key) {
      // do not trigger the callback function
      // but still change state to fit new selection
      return;
    }
    // change state to fit new selection
    setLastValidItem(selectedItem);
    // callback function onSelect
    onSelect(selectedItem);
  }, [suppressReselect, clearInputOnSelect, onDropdownClose,
    lastValidItem, isMatchingDebounced, onSelect]);

  /**
     * handle key events
     * @param event
     */
  const onHandleKeydown = useCallback((event) => {
    // only do something if drop-down div is visible
    if (!visibleRef.current) return;
    let currentFocusIndex = focusIndex;
    if (event.keyCode === 40 || event.keyCode === 9) {
      // If the arrow DOWN key or tab is pressed increase the currentFocus variable:
      currentFocusIndex += 1;
      if (currentFocusIndex >= matchingItems.length) currentFocusIndex = 0;
      setFocusIndex(currentFocusIndex);
      // prevent tab to jump to the next input field if drop down is still open
      event.preventDefault();
    } else if (event.keyCode === 38) {
      // If the arrow UP key is pressed, decrease the currentFocus variable:
      currentFocusIndex -= 1;
      if (currentFocusIndex <= -1) currentFocusIndex = matchingItems.length - 1;
      setFocusIndex(currentFocusIndex);
    } else if (event.keyCode === 13) {
      // Enter pressed, similar to onClickItem
      if (focusIndex > -1) {
        // Simulate a click on the "active" item:
        const selectedItem = matchingItems[currentFocusIndex];
        onHandleSelect(selectedItem);
      }
    }
  }, [focusIndex, matchingItems, onHandleSelect]);

  const renderItemLabel = useCallback((item) => {
    const index = indexOfMatch(currentInput, item);
    const inputLength = currentInput.length;
    return (
      <React.Fragment>
        { index >= 0 && inputLength
          // renders label with matching search string marked
          ? (
            <React.Fragment>
              {item.label.substr(0, index) }
              <strong>
                { item.label.substr(index, inputLength) }
              </strong>
              { item.label.substr(index + inputLength, item.label.length) }
            </React.Fragment>
          )
          : item.label }
      </React.Fragment>
    );
  }, [currentInput]);

  const renderItems = useCallback(() => (
    <div ref={menu} className={`datalist-items ${dropdownClassName || 'default-datalist-items'}`}>
      {matchingItems.map((item, i) => {
        const isActive = focusIndex === i;
        const itemActiveClasses = isActive
          ? `datalist-active-item ${activeItemClassName || 'datalist-active-item-default'}` : '';
        const itemClasses = `${itemClassName} ${itemActiveClasses}`;
        return (
          <div
            onClick={() => onHandleSelect(item)}
            className={itemClasses}
            key={item.key}
            tabIndex={0}
            role="button"
            onKeyUp={event => event.preventDefault()}
          >
            {renderItemLabel(item)}
          </div>
        );
      })}
    </div>
  ), [dropdownClassName, matchingItems, focusIndex,
    activeItemClassName, itemClassName, onHandleSelect, renderItemLabel]);

  const renderLoader = useCallback(() => (
    <div ref={menu} className={`datalist-items ${dropdownClassName || 'default-datalist-items'}`}>
      <div className={itemClassName}>{debounceLoader || 'loading...'}</div>
    </div>
  ), [dropdownClassName, itemClassName, debounceLoader]);

  const dropDown = useMemo(() => {
    const reachedRequiredLength = currentInputRef.current.length >= requiredInputLength;
    if (reachedRequiredLength && isMatchingDebounced) {
      return renderLoader();
    }
    if (reachedRequiredLength && visible) {
      return renderItems();
    }
    return undefined;
  }, [requiredInputLength, isMatchingDebounced, renderItems, renderLoader, visible]);


  return (
    <div className="datalist-input">
      <input
        ref={inputField}
        onChange={onHandleInput}
        onClick={onClickInput}
        onKeyDown={onHandleKeydown}
        type="text"
        className={`autocomplete-input ${inputClassName}`}
        placeholder={placeholder}
        value={currentInput}
      />
      { dropDown }
    </div>
  );
};

DataListInput.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
    }),
  ).isRequired,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onDropdownOpen: PropTypes.func,
  onDropdownClose: PropTypes.func,
  match: PropTypes.func,
  inputClassName: PropTypes.string,
  dropdownClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  activeItemClassName: PropTypes.string,
  requiredInputLength: PropTypes.number,
  clearInputOnSelect: PropTypes.bool,
  suppressReselect: PropTypes.bool,
  dropDownLength: PropTypes.number,
  initialValue: PropTypes.string,
  debounceTime: PropTypes.number,
  debounceLoader: PropTypes.node,
  onInput: PropTypes.func,
};

DataListInput.defaultProps = {
  placeholder: '',
  match: undefined,
  inputClassName: '',
  dropdownClassName: '',
  itemClassName: '',
  activeItemClassName: '',
  requiredInputLength: 0,
  clearInputOnSelect: false,
  suppressReselect: true,
  dropDownLength: Infinity,
  initialValue: '',
  debounceTime: 0,
  debounceLoader: undefined,
  onDropdownOpen: () => {},
  onDropdownClose: () => {},
  onInput: () => {},
};

export default DataListInput;
