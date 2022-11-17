import type {
  PropsWithChildren,
  PropsWithRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  CSSProperties,
  RefObject,
  MutableRefObject,
  SetStateAction,
  Dispatch,
} from 'react';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useDeferredValue,
  useId,
} from 'react';

/*
 * References:
 * [ARIA1.1#comboBox]: https://www.w3.org/TR/wai-aria-1.1/#combobox
 * [ARIA1.2#comboBox]: https://www.w3.org/TR/wai-aria-1.2/#combobox
 *
 * Low-level Components:
 * - ComboboxInput: The textbox input field
 * - Listbox: The container that holds the list of options
 * - ListboxOption: One listbox option
 * - Highlight: Highlighting of matching text of the listbox option
 *
 * High-level Components:
 * - Combobox: A container that you can pass all low-level components yourself (advanced use-cases)
 * - DatalistInput: A container that renders all low-level components for you (simple use-cases)
 */

/*
 * "Typically, the default state of a combobox is collapsed." [ARIA1.1#combobox]
 * If the developer does not manage the open state on its own, by default this component will collapse the listbox.
 * This ensures that the datalist input components (by default) matches the behavior of the native datalist element
 */
const DEFAULT_IS_EXPANDED = false;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/*
 * Utilities
 */

const contextRequiredWarning = (name: string) =>
  `The ${name} component must be a child of Combobox. Please wrap the component inside Combobox to ensure that the required context is available.`;

/**
 * This function is inspired by tiny-warning: https://github.com/alexreardon/tiny-warning
 */
function assertWithWarning(condition: boolean, text: string): void {
  // wrapping in production check for better dead code elimination
  if (!IS_PRODUCTION) {
    if (condition) {
      return;
    }

    // check console for IE9 support which provides console
    if (typeof console !== 'undefined') {
      console.warn(text);
    }

    // Throwing an error and catching it immediately
    // to improve debugging
    // A consumer can use 'pause on caught exceptions'
    // https://github.com/facebook/react/issues/4216
    try {
      throw Error(text);
    } catch (x) {}
  }
}

/**
 * Composes different event handlers into a single event handler.
 */
type HandleWith = <Event>(...fns: Array<((e: Event) => void) | undefined>) => (e: Event) => void;
const handleWith: HandleWith =
  (...fns) =>
  (e) =>
    fns.forEach((fn) => fn && fn(e));

/*
 * Hooks and context
 */

type ComboboxContext = {
  contextAvailable: boolean; // Flag that context is available
  listboxId?: string; // The element that describes the option list of the element. [ARIA1.1#combobox]
  selectedItemId?: string; // The element that describes the selected option of the combobox.
  isExpanded?: boolean;
  currentInputValue?: string;
};

const ComboboxContext = createContext<ComboboxContext>({
  contextAvailable: true,
  listboxId: '',
  selectedItemId: '',
  isExpanded: DEFAULT_IS_EXPANDED,
  currentInputValue: '',
});

const useComboboxContext = () => useContext(ComboboxContext);

/**
 * Use this hook to control the open state and input value of the combobox.
 * Pass the properties down to the DataListInput component.
 */
const useComboboxControls = (params?: { isExpanded: boolean; initialValue?: string }) => {
  const [isExpanded, setIsExpanded] = useStateRef(params?.isExpanded);
  const [value, setValue] = useState(params?.initialValue || '');
  return {
    isExpanded,
    value,
    setIsExpanded,
    setValue,
  };
};

/**
 * An elegant way to style elements based on the current state of the component.
 * Inspired by react-router: https://v5.reactrouter.com/web/api/NavLink/classname-string-func
 */
type ClassNameFunction<Params> = (params: Params) => string;
type ClassName<Params> = HTMLAttributes<HTMLLIElement>['className'] | ClassNameFunction<Params>;
function useClassNameStr<Params>(className: ClassName<Params>, params: Params) {
  return useMemo(
    () => (!className || typeof className === 'string' ? className : className(params)),
    [params, className],
  );
}

type UseComboboxHelpersConfigParams = {
  itemsRef: MutableRefObject<Item[]>;
  listboxRef: RefObject<HTMLElement>;
  comboboxInputRef: RefObject<HTMLInputElement>;
  isExpandedRef: React.MutableRefObject<boolean>;
  onSelect?: (item: Item) => void;
  setIsExpanded?: (isExpanded: boolean) => void;
  setValue?: (value: string) => void;
  setSelectedItem?: (item: Item) => void;
};

/**
 * The helpers returned by this hook can be used
 * to construct a custom Combobox behavior to your liking.
 * Wrap the low-level components in the Combobox component
 * and pass the helpers down if you need them.
 */
function useComboboxHelpers({
  itemsRef,
  listboxRef,
  comboboxInputRef,
  onSelect,
  isExpandedRef,
  setIsExpanded,
  setValue,
  setSelectedItem,
}: UseComboboxHelpersConfigParams) {
  /**
   * onChange callback for input field
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (setValue) setValue(e.currentTarget.value);
      if (setIsExpanded) setIsExpanded(true);
    },
    [setValue, setIsExpanded],
  );

  /**
   * onFocus callback for input field
   */
  const expandOnFocus = useCallback(() => {
    if (!isExpandedRef.current && setIsExpanded) setIsExpanded(true);
  }, [setIsExpanded]);

  const handleCloseDatalist = useCallback(() => {
    if (isExpandedRef.current && setIsExpanded) setIsExpanded(false);
  }, [setIsExpanded]);

  /**
   * onKeyDown/onKeyUp callback for window
   */
  const closeOnEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleCloseDatalist();
  }, []);

  /**
   * onClick callback for window
   */
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!comboboxInputRef.current || !listboxRef.current) return;
      const targetElement = e.target;
      if (
        !targetElement ||
        (!listboxRef.current.contains(targetElement as HTMLElement) && targetElement !== comboboxInputRef.current)
      ) {
        handleCloseDatalist();
      }
    },
    [handleCloseDatalist],
  );

  /**
   * onFocus callback for window
   */
  const handleFocusOutside = useCallback(() => {
    if (!comboboxInputRef.current || !listboxRef.current) return;
    const activeElement = document.activeElement;
    if (!activeElement || (!listboxRef.current.contains(activeElement) && activeElement !== comboboxInputRef.current)) {
      handleCloseDatalist();
    }
  }, [handleCloseDatalist]);

  /**
   * Callback for item selection (enter/click)
   */
  const handleSelect = useCallback(
    (item: Item) => {
      // return focus to input field after selection
      if (comboboxInputRef.current) comboboxInputRef.current.focus();
      if (setValue) setValue(item.value);
      if (setIsExpanded) setIsExpanded(false);
      if (setSelectedItem) setSelectedItem(item);
      if (onSelect) onSelect(item); // onSelect at last to allow override of previous state changes
    },
    [setValue, onSelect, setIsExpanded, setSelectedItem],
  );

  /**
   * keyDown callback for input field
   */
  const handleKeyDownOnInput = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Control+Option+Space is used by VoiceOver on Mac to open the menu
      const isControlOptionSpace = e.code === 'Space' && e.ctrlKey && e.altKey;
      const shouldVisitItems = e.key === 'ArrowDown' || isControlOptionSpace;
      if (!listboxRef.current || !shouldVisitItems) return;
      if (isControlOptionSpace) e.preventDefault();
      if (isExpandedRef.current) {
        const firstOption = listboxRef.current.firstElementChild as HTMLLIElement | null;
        if (firstOption && typeof firstOption.focus === 'function') firstOption.focus();
      } else if (setIsExpanded) {
        setIsExpanded(true);
        // wait for next tick (render)
        window.setTimeout(() => {
          if (!listboxRef.current) return;
          const firstOption = listboxRef.current.firstElementChild as HTMLLIElement | null;
          if (firstOption && typeof firstOption.focus === 'function') firstOption.focus();
        });
      }
    },
    [setIsExpanded],
  );

  /**
   * keyDown callback for list element (listbox option)
   * Uses keyDown instead of keyUp to support "long-press" to quickly navigate through list
   */
  const handleKeyDownOnListboxOption = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (!itemsRef.current) return;
      const item = itemsRef.current.find((item) => item.id === e.currentTarget.id);
      if (!item) return;
      if (e.key === 'Enter') return handleSelect(item); // Enter should act as Click. This will also submit a one input form correctly with the latest value.
      if (!listboxRef.current || e.key === 'Escape' || e.key === 'Tab' || e.key === 'Shift') return; // Do nothing on meta keys

      // Used for navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Alt') {
        e.preventDefault(); // prevent safari from doing crazy text selection things
        let nextNode: Element | null = null;
        if (e.key === 'ArrowDown' || e.key === 'Alt') {
          nextNode = e.currentTarget.nextElementSibling || listboxRef.current.firstElementChild;
        } else {
          nextNode = e.currentTarget.previousElementSibling || listboxRef.current.lastElementChild;
        }

        if (!nextNode) return;
        const nextOption = nextNode as HTMLLIElement;
        if (nextOption && typeof nextOption.focus === 'function') nextOption.focus();
        return;
      }

      // Anything else should go to the input field
      if (!comboboxInputRef.current) return;
      comboboxInputRef.current.focus();
      comboboxInputRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: e.key }));
    },
    [handleSelect],
  );

  return {
    closeOnEscape,
    handleClickOutside,
    handleFocusOutside,
    handleChange,
    expandOnFocus,
    handleSelect,
    handleKeyDownOnInput,
    handleKeyDownOnListboxOption,
  };
}

/*
 * Low-level components
 */

type ComboboxInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  value?: string;
};

/**
 * The textbox input field.
 * Does currently not implement aria-activedescendant which is not obligatory for datalist input components.
 * Autocomplete off to prevent browser autocomplete from interfering with our own; can be overridden with props.
 */
const ComboboxInput = forwardRef<HTMLInputElement, PropsWithRef<ComboboxInputProps>>(
  ({ value, ...props }, forwardedRef) => {
    const { contextAvailable, listboxId, isExpanded } = useComboboxContext();
    assertWithWarning(contextAvailable, contextRequiredWarning(ComboboxInput.name));

    return (
      <input
        autoComplete="off"
        {...props}
        ref={forwardedRef}
        value={value}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={isExpanded}
        aria-controls={listboxId}
      />
    );
  },
);
ComboboxInput.displayName = 'ComboboxInput';

type HighlightProps = HTMLAttributes<HTMLElement> & {
  currentInput?: string;
  as?: 'mark' | 'span';
};

/**
 * Optional highlight component for the listbox option text.
 * Should be wrapped by ListboxOption. Provide ListBoxOption an aria-label to ensure accessibility, especially if using mark.
 */
const Highlight: React.FC<PropsWithChildren<HighlightProps>> = ({
  children,
  currentInput = '',
  as = 'mark',
  ...props
}) => {
  const markedChildren = useMemo(() => {
    if (typeof children !== 'string') {
      return children;
    }
    const index = children.toLowerCase().indexOf(currentInput.toLowerCase());
    const inputLength = currentInput.length;
    if (index === -1 || !inputLength) {
      return children;
    }
    return (
      <>
        {children.substring(0, index)}
        {as === 'mark' ? (
          <mark {...props}>{children.substring(index, index + inputLength)}</mark>
        ) : (
          <span {...props}>{children.substring(index, inputLength)}</span>
        )}
        {children.substring(index + inputLength, children.length)}
      </>
    );
  }, [currentInput, children]);

  return <>{markedChildren}</>;
};

type ListboxOptionClassNameParams = { isSelected: boolean };
type ListboxOptionProps = Omit<HTMLAttributes<HTMLLIElement>, 'className'> & {
  className?: ClassName<ListboxOptionClassNameParams>;
};

/**
 * One listbox option.
 */
const ListboxOption = forwardRef<HTMLLIElement, PropsWithRef<ListboxOptionProps>>(
  ({ children, id, className, ...props }, forwardedRef) => {
    const { selectedItemId } = useComboboxContext();
    const classNameStr = useClassNameStr<ListboxOptionClassNameParams>(className, {
      isSelected: !!id && id === selectedItemId,
    });

    return (
      <li {...props} ref={forwardedRef} id={id} className={classNameStr} role="option">
        {children}
      </li>
    );
  },
);
ListboxOption.displayName = 'ListboxOption';

type ListboxProps = HTMLAttributes<HTMLUListElement>;

/**
 * The combobox popup list.
 */
const Listbox = forwardRef<HTMLUListElement, PropsWithRef<ListboxProps>>(({ children, ...props }, forwardedRef) => {
  const { contextAvailable, listboxId, isExpanded } = useComboboxContext();
  assertWithWarning(contextAvailable, contextRequiredWarning(Listbox.name));
  const isExpandedRef = useRef(isExpanded);
  const [hasExpanded, setHasExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      setHasExpanded(false);
    } else if (isExpanded && isExpanded !== isExpandedRef.current) {
      setHasExpanded(true);
    }
    isExpandedRef.current = isExpanded; // drag pointer to the old value
  }, [isExpanded]);

  // TODO https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live instead of title
  return (
    <ul
      {...props}
      ref={forwardedRef}
      id={listboxId}
      role="listbox"
      aria-live={hasExpanded ? props['aria-live'] || 'polite' : 'off'}
    >
      {children}
    </ul>
  );
});
Listbox.displayName = 'Listbox';

/*
 * Combobox - high-level component
 */

type ComboboxProps = {
  listboxId?: ComboboxContext['listboxId'];
  selectedItemId?: ComboboxContext['selectedItemId'];
  isExpanded?: ComboboxContext['isExpanded'];
  currentInputValue?: ComboboxContext['currentInputValue'];
};

type Combobox = React.FC<PropsWithChildren<ComboboxProps>> & {
  ComboboxInput: typeof ComboboxInput;
  Listbox: typeof Listbox;
  ListboxOption: typeof ListboxOption;
  Highlight: typeof Highlight;
};

/**
 * A container that you can pass all low-level components yourself for advanced use-cases.
 * The Combobox provides the context for the combobox low-level components.
 */
const Combobox: Combobox = ({ currentInputValue, listboxId, selectedItemId, isExpanded = true, children }) => {
  const id = useId();
  return (
    <ComboboxContext.Provider
      value={{ currentInputValue, contextAvailable: true, listboxId: listboxId || id, selectedItemId, isExpanded }}
    >
      {children}
    </ComboboxContext.Provider>
  );
};

Combobox.ComboboxInput = ComboboxInput;
Combobox.Listbox = Listbox;
Combobox.ListboxOption = ListboxOption;
Combobox.Highlight = Highlight;

/*
 * DatalistInput - high-level component & its utilities
 */

/**
 * Internal hook used to create a ref for a state value to allow access to the state value without triggering a re-render.
 */
function useStateRef<S>(initialState: S): [S, (newState: S) => void, React.MutableRefObject<S>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(initialState);
  const setStateRef = (newState: S) => {
    setState(newState);
    ref.current = newState;
  };
  return [state, setStateRef, ref];
}

/**
 * Internal hook used to manipulate the value of the input field.
 */
const useInternalValue = (
  value?: string,
  setValue?: (str: string) => void | Dispatch<SetStateAction<string>>,
): [string, (str: string) => void] => {
  const [internalValue, setInternalValue] = useState(value || '');
  const setValues = useCallback(
    (newValue: string) => {
      if (setValue) {
        setValue(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [setValue],
  );

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  return [internalValue, setValues];
};

/**
 * Internal hook to keep track of the selected item.
 */
function useInternalSelectedItem(item?: Item): [Item | undefined, (item: Item) => void] {
  const [selectedItem, setSelectedItem] = useState(item);

  useEffect(() => {
    setSelectedItem(item);
  }, [item]);

  return [selectedItem, setSelectedItem];
}

type Item = Record<string, unknown> & {
  id: string;
  value: string; // Used for filtering. Used for displaying and highlighting if node not provided.
  node?: ReactNode; // Used for display.
  label?: string; // If provided, will be used as the aria-label on the list element. If not provided, value will be used instead.
};

type Filter = (items: Item[], value?: ComboboxInputProps['value']) => Item[];

/**
 * Alternative function for matching the current input value (needle) and the values of the items array.
 * Returns true if item.value is not of type string (all items will be displayed and a custom filter must be used).
 */
const startsWithValueFilter: Filter = (items, value = '') =>
  items.filter((item) =>
    typeof item.value === 'string' ? item.value.substring(0, value.length).toLowerCase() === value.toLowerCase() : true,
  );

/**
 * Default function for matching the current input value (needle) and the values of the items array.
 * Returns true if item.value is not of type string (all items will be displayed and a custom filter must be used).
 */
const includesValueFilter: Filter = (items, value = '') =>
  items.filter((item) =>
    typeof item.value === 'string' ? item.value.toLowerCase().includes(value.toLocaleLowerCase()) : true,
  );

function useFilters(
  items: Item[],
  value: ComboboxInputProps['value'],
  filters: Filter[],
): [Item[], MutableRefObject<Item[]>] {
  const filteredRef = useRef<Item[]>(items);
  const filtered = useMemo(
    () => filters.reduce((currentItems, filter) => filter(currentItems, value), items),
    [items, filters, value],
  );

  useEffect(() => {
    filteredRef.current = filtered;
  }, [filtered]);

  return [filtered, filteredRef];
}

type LabelOptionProps =
  | {
      showLabel?: false;
      label: string;
    }
  | {
      showLabel?: true;
      label: ReactNode;
    };

type LabelProps = HTMLAttributes<HTMLLabelElement>;

// eslint-disable-next-line @typescript-eslint/ban-types
type DatalistInputProps = LabelOptionProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> & {
    items: Item[];
    selectedItem?: Item;
    value?: ComboboxInputProps['value'];
    setValue?: UseComboboxHelpersConfigParams['setValue'];
    onSelect?: UseComboboxHelpersConfigParams['onSelect'];
    isExpanded?: ComboboxContext['isExpanded'];
    setIsExpanded?: UseComboboxHelpersConfigParams['setIsExpanded'];
    placeholder?: ComboboxInputProps['placeholder'];
    filters?: Filter[];
    inputProps?: ComboboxInputProps;
    labelProps?: LabelProps;
    listboxProps?: ListboxProps;
    listboxOptionProps?: ListboxOptionProps;
    isExpandedClassName?: string;
    isCollapsedClassName?: string;
    isExpandedStyle?: CSSProperties;
    isCollapsedStyle?: CSSProperties;
  };

/**
 * DatalistInput implements all lower-level components for you and provides a simple API for controlling the combobox.
 * Note: Use the useComboboxControls hook to control the value and expanded state of the combobox.
 * DatalistInput implements the ARIA1.2#comboBox specification, including keyboard navigation with ArrowUp and ArrowDown.
 * DatalistInput does currently not implement aria-activedescendant but shifts the focus to the listbox options on ArrowUp and ArrowDown.
 * Note: tabIndex of all listbox options is set to -1 to allow the user to use tab or shift tab to jump out of the datalist without the need to tab through all options.
 */
const DatalistInput = forwardRef<HTMLDivElement, PropsWithRef<DatalistInputProps>>(
  (
    {
      label,
      showLabel = true,
      items,
      selectedItem,
      value,
      setValue,
      onSelect,
      placeholder,
      isExpanded = DEFAULT_IS_EXPANDED,
      setIsExpanded,
      filters = [includesValueFilter],
      inputProps,
      labelProps,
      listboxOptionProps,
      listboxProps,
      isExpandedClassName = '',
      isCollapsedClassName = '',
      isExpandedStyle,
      isCollapsedStyle,
      ...props
    },
    forwardedRef,
  ) => {
    const [internalIsExpanded, setInternalIsExpanded, isExpandedRef] = useStateRef(isExpanded);
    const [internalValue, setInternalValue] = useInternalValue(value, setValue);
    const internalTextboxId = useId();
    const debounceValue = useDeferredValue(internalValue);
    const [filteredItems, filteredItemsRef] = useFilters(items, debounceValue, filters);
    const listboxRef = useRef<HTMLUListElement>(null);
    const comboboxInputRef = useRef<HTMLInputElement>(null);
    const [internalSelectedItem, setSelectedItem] = useInternalSelectedItem(selectedItem);

    const setIsExpandedStates = useCallback(
      (state: boolean) => (setIsExpanded ? setIsExpanded(state) : setInternalIsExpanded(state)),
      [setIsExpanded],
    );

    const {
      handleClickOutside,
      handleFocusOutside,
      closeOnEscape,
      handleChange,
      expandOnFocus,
      handleSelect,
      handleKeyDownOnInput,
      handleKeyDownOnListboxOption,
    } = useComboboxHelpers({
      listboxRef,
      comboboxInputRef,
      isExpandedRef,
      setValue: setInternalValue,
      onSelect,
      itemsRef: filteredItemsRef,
      setIsExpanded: setIsExpandedStates,
      setSelectedItem,
    });

    useEffect(() => {
      setInternalIsExpanded(isExpanded);
    }, [isExpanded]);

    useEffect(() => {
      // separate useEffect so we don't re-run it twice with each dependency change
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('keyup', closeOnEscape);
      return () => {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('keyup', closeOnEscape);
      };
    }, [handleClickOutside]);

    useEffect(() => {
      // separate useEffect so we don't re-run it twice with each dependency change
      window.addEventListener('focusin', handleFocusOutside);
      return () => {
        window.removeEventListener('focusin', handleFocusOutside);
      };
    }, [handleFocusOutside]);

    return (
      <div {...props} ref={forwardedRef} className={`react-datalist-input__container ${props.className}`}>
        <Combobox
          listboxId={listboxProps?.id}
          selectedItemId={internalSelectedItem?.id}
          isExpanded={internalIsExpanded}
          currentInputValue={internalValue}
        >
          {showLabel && (
            <label
              {...labelProps}
              className={`react-datalist-input__label ${labelProps?.className}`}
              htmlFor={inputProps?.id || internalTextboxId}
            >
              {label}
            </label>
          )}
          <ComboboxInput
            {...inputProps}
            ref={comboboxInputRef}
            id={inputProps?.id || internalTextboxId}
            placeholder={placeholder}
            value={internalValue}
            onClick={handleWith(expandOnFocus, inputProps?.onClick)}
            onFocus={handleWith(expandOnFocus, inputProps?.onFocus)}
            onChange={handleWith(handleChange, inputProps?.onChange)}
            onKeyDown={handleWith(handleKeyDownOnInput, inputProps?.onKeyDown)}
            aria-label={!showLabel && typeof label === 'string' ? label : undefined}
            className={`react-datalist-input__textbox ${inputProps?.className}`}
          />
          {((filteredItems.length && internalIsExpanded) || isCollapsedClassName || isCollapsedStyle) && (
            <Listbox
              {...listboxProps}
              ref={listboxRef}
              aria-hidden={internalIsExpanded}
              className={`react-datalist-input__listbox ${
                internalIsExpanded ? isExpandedClassName : isCollapsedClassName
              } ${listboxProps?.className || ''}`}
              style={{
                ...(internalIsExpanded ? isExpandedStyle : isCollapsedStyle),
                ...listboxProps?.style,
              }}
            >
              {filteredItems.map((item) => (
                <ListboxOption
                  {...listboxOptionProps}
                  aria-label={item.label || item.value}
                  key={item.id}
                  id={item.id}
                  tabIndex={-1}
                  onClick={handleWith(() => handleSelect(item), listboxOptionProps?.onClick)}
                  onKeyDown={handleWith(handleKeyDownOnListboxOption, listboxOptionProps?.onKeyDown)}
                  className={`react-datalist-input__listbox-option ${listboxOptionProps?.className}`}
                >
                  <Highlight currentInput={internalValue}>{item.node || item.value}</Highlight>
                </ListboxOption>
              ))}
            </Listbox>
          )}
        </Combobox>
      </div>
    );
  },
);
DatalistInput.displayName = 'DatalistInput';

export type {
  DatalistInputProps,
  ComboboxProps,
  ComboboxInputProps,
  ListboxProps,
  ListboxOptionProps,
  HighlightProps,
  UseComboboxHelpersConfigParams,
  Item,
  Filter,
};

export {
  Combobox,
  DatalistInput,
  startsWithValueFilter,
  includesValueFilter,
  useFilters,
  useComboboxContext,
  useComboboxControls,
  useComboboxHelpers,
};

export default DatalistInput;
