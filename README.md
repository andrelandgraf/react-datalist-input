![Simple demo of DatalistInput](/media/demo.gif)

# react-datalist-input

react-datalist-input provides a React datalist/combobox component called DatalistInput. The component contains an input field with a dropdown menu of suggestions based on the current input.

_DatalistInput is intended to be easy to use and comes with default styling:_

```jsx
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/style.css';

const YourComponent = () => (
  <DatalistInput
    placeholder="Chocolate"
    label="Select ice cream flavor"
    onSelect={(item) => console.log(item.value)}
    items={[
      { id: 'Chocolate', value: 'Chocolate' },
      { id: 'Coconut', value: 'Coconut' },
      { id: 'Mint', value: 'Mint' },
      { id: 'Strawberry', value: 'Strawberry' },
      { id: 'Vanilla', value: 'Vanilla' },
    ]}
  />
);
```

_But DatalistInput is also intented to be easy to extend:_

```jsx
import DatalistInput, { useComboboxControls } from 'react-datalist-input';

const YourComponent = () => {
  const { setValue, value } = useComboboxControls({ initialValue: 'Chocolate' });

  return (
    <DatalistInput
      value={value}
      setValue={setValue}
      label="Select ice cream flavor"
      showLabel={false}
      items={[...]}
      onSelect={(item) => {
        setValue(''); // Custom behavior: Clear input field once a value has been selected
      }}
    />
  );
};
```

## Installation

**Note: React 18 required!** Version 3.0.0 utilizes React 18. If you are using a React version below 18, install `react-datalist-input@2.2.1` instead! Find the documentation for version 2.2.1 [here](https://github.com/andrelandgraf/react-datalist-input/blob/bab05504c0dffa5f9343f2fcb5f075a38bad2512/README.md).

### npm

```bash
npm i react-datalist-input
```

### yarn

```bash
yarn add react-datalist-input
```

## When to use this package (and when not to use it)?

TL;DR:

- You want a dropdown of suggestions and not a select element.
- You tried the datalist HTML 5 element but it doesn't offer the control you need.

There are [various kinds of dropdown UI controls](https://adrianroselli.com/2020/03/stop-using-drop-down.html). This package implements one of them - the combobox control - as defined by [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#combobox).

A combobox renders a list of suggested values based on an input field. The user can select an option of the list to autocomplete the input field or type in a value that is not in the list. This is the main difference to the [select control](<[select](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)>), where the user must pick a value from the list. You can read more about the differences on [vitalflux.com](https://vitalflux.com/difference-select-datalist/).

If you don't care about custom functionality or advanced styling, consider using the native [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) HTML5 element. If you require more control, then this package is for you!

You can also build something tailored to your own use case from scratch! Have a look at [w3schools.com](https://www.w3schools.com/howto/howto_js_autocomplete.asp) to see how you create a autocomplete control with pure HTML, CSS, and JS.

## ARIA

This package follows the [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) specification. Be aware that version 1.2 is still in development. If you require a more battle-tested ARIA implementation, consider using [Reach UI](https://reach.tech/combobox/) instead.

This package does not implement the optional `aria-activedescendant` property but rather programatically shifts focus to the active item. This might be up to change in the future!

## Feedback & Issues

Please provide your [feedback](https://github.com/andrelandgraf/react-datalist-input/issues) on GitHub!

## Versions

- Version 3.x.x is written in TypeScript and requires React 18.
- Version 2.x.x serves a functional component using hooks.
- Version 1.x.x serves a class component.

The documentation below only applies to the latest version. Please find earlier versions of the documentation on [GitHub](https://github.com/andrelandgraf/react-datalist-input), e.g. version [2.2.1](https://github.com/andrelandgraf/react-datalist-input/blob/bab05504c0dffa5f9343f2fcb5f075a38bad2512/README.md).

### Changelog

### Version 3.0.0

Full refactor of react-datalist-input.

- Rewritten in TypeScript
- Implements WAI-ARIA 1.2
- Takes advantage of React 18 useDeferredValue and useId
- Replaces custom debounce with React 18 useDeferredValue
- New default styles using CSS variables
- Exposes helper hooks
- Exposes underlying components for full customization

**Note:** Be aware that version 3.0.0 includes breaking changes. Version 3.0.0 deprecates some properties from the DatalistInput component but all but one use case still be implemented in the new version (in a more intuitive way using the `useComboboxControls` hook). The only property that has been fully depcreated is `requiredInputLength`. Please create an [Issue](https://github.com/andrelandgraf/react-datalist-input/issues) if you need it!

#### Version 2.2.0

- Update React peer-dependency version to 17.0.2

#### Version 2.1.0

Motivation: [Issue 23](https://github.com/andrelandgraf/react-datalist-input/issues/23)

Offer optional value prop, in case the user requires full control to change/clear the input value based on side effects

Changes:

- Deprecates optional `initialValue` prop
- Introduces optional `value` prop instead (default undefined)
- Introduces optional `clearOnClickInput` prop (default false)
- Introduces optional `onClick` lifecycle method prop (default empty function)

#### Version 2.0.0

Changes:

- refactors component to functional component using hooks
- adds `useStateRef` to reduce re-renders and boost performance

## Usage

### Basic Usage

```jsx
import React, { useState, useMemo, useCallback } from 'react';
// Import the DataListInput component
import DataListInput from 'react-datalist-input';
// Tntegrate the css file if you want to use the default styling
import 'react-datalist-input/dist/style.css';

const options = [
  { name: 'Chocolate' },
  { name: 'Coconut' },
  { name: 'Mint' },
  { name: 'Strawberry' },
  { name: 'Vanilla' },
];

const YourComponent = ({ options }) => {
  const [item, setItem] = useState(); // The selectedItem

  /**
   * The onSelect callback function is called if the user selects one option out of the dropdown menu.
   * @param selectedItem object (the selected item / option)
   */
  const onSelect = useCallback((selectedItem) => {
    console.log('selectedItem', selectedItem);
    setItem(selectedItem);
  }, []);

  // Make sure each option has an unique id and a value
  const items = useMemo(
    () =>
      options.map((option) => ({
        // required: id and value
        id: option.name,
        value: option.name,
        // optional: label, node
        // label: option.name, // use a custom label instead of the value
        // node: option.name, // use a custom ReactNode to display the option
        ...option, // pass along any other properties, will be available in your onSelect callback
      })),
    [yourItems],
  );

  return (
    <DatalistInput label="Select your favorite flavor" placeholder="Chocolate" items={items} onSelect={onSelect} />
  );
};
```

### Styling

For simple use cases, you can use the default styling provided by this package: `import 'react-datalist-input/dist/style.css'`.

However, you can also customize the styling by providing your own CSS! Instead of importing the default stylesheet, create your own one. The following classes are available:

- `react-datalist-input__container`: For the container element.
- `react-datalist-input__textbox`: For the input element.
- `react-datalist-input__listbox`: For the dropdown list.
- `react-datalist-input__listbox-option`: For each option in the dropdown list.

**Note:** To get up and running quickly, just copy-paste the default stylesheet and adapt the pieces you need.

#### Tailwind CSS / Utility Classes

Alternatively, you can also pass custom classes to each element of the DatalistInput component by using the following props:

- `className`: For the container element.
- `inputProps["className"]`: For the input element.
- `listboxProps["className"]`: For the dropdown list.
- `listboxOptionProps["className"]`: For each option in the dropdown list.
- `isExpandedClassName`: Applied to the dropdown list if it is expanded.
- `isCollapsedClassName`: Applied to the dropdown list if it is collapsed. !If provided, you must manage the hiding of the dropdown list yourself!

### Custom Filtering

You can chain custom filters to filter the list of options displayed in the dropdown menu.

For instance, display only the first three items in the list:

```jsx
// Import the default filter startWithValueFilter
import DatalistInput, { startsWithValueFilter } from '../combobox';

const YourComponent = () => {
  // Custom filter: Only display the first 3 items
  const limitOptionsFilter: Filter = useCallback((options, value) => options.slice(0, 3), [selectedItems]);

  // First we filter by the value using the default filter, then we add a custom filter.
  const filters = [startsWithValueFilter, customFilter];

  return <DatalistInput label="Select ice cream flavor" items={items} filters={filters} />;
};
```

### Fine-grained Control

Use the `useComboboxControls` hook to get fine-grained control over the input value and the dropdown expansion states or just manage the value and expanded state yourself!

In this example, we utilize DatalistInput to act as a multi-select control:

```jsx
import { DatalistInput, useComboboxControls, startsWithValueFilter } from '../combobox';

const YourComponent = () => {
  // useComboboxControls returns state and handlers for the input value and the dropdown expansion state
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: true });
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    // Abitrary logic: Close select after 3 selections
    if (selectedItems.length === 3) {
      setIsExpanded(false);
    }
  }, [selectedItems]);

  // Custom filter: Filter displayed items based on previous selections
  const customFilter: Filter = useCallback(
    (options, value) => {
      return options.filter((o) => !selectedItems.find((s) => s.id === o.id));
    },
    [selectedItems],
  );

  return (
    <DatalistInput
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      value={value}
      setValue={setValue}
      onSelect={(item) => {
        if (selectedItems.length >= 3) setSelectedItems([item]);
        else setSelectedItems((prevItems) => [...prevItems, item]); // Add the selected item to the list of selected items
        setValue(''); // Clear the input value after selection
        setIsExpanded(true); // Keep dropdown open after selection
      }}
      label="Select ice cream flavor"
      items={items}
      filters={[customFilter, startsWithValueFilter]}
    />
  );
};
```

## Properties

DatalistInput accepts the following properties:

### Required Properties

- `items`: An array of objects of type `Item` with the following properties:
  - id: Required. The unique identifier for the option.
  - value: Required. The value of the option.
  - label: Optional. The label of the option.
  - node: Optional. A React node to display the option.
  - ...: Any other properties you want to pass along to your onSelect callback.
- `label`: The label of the input. Can be of type ReactNode or string.
- `showLabel`: Whether to show the label. If not provided, defaults to true. If false, the label will not be shown but the label property must be of type string and will be supplied to the `aria-label` attribute.

### Optional Properties

- `placeholder`: The placeholder of the input.
- `value`: The value of the input.
- `setValue`: A function to set the value of the input.
- `isExpanded`: Whether the dropdown is expanded.
- `setIsExpanded`: A function to set the expanded state of the dropdown.
- `onSelect`: A callback function that is called when the user selects an option.
- `filters`: An array of filters of type `Filter` that are applied to the list of options displayed in the dropdown menu.
- `selectedItem`: The currently selected item. Important for ARIA. DatalistInput keeps track of the last selected item. You only need to provide this prop if you want to change the selected item outside of the component.
- `inputProps`: An object of props to pass to the combobox input element.
- `listboxProps`: An object of props to pass to the listbox element.
- `listboxOptionProps`: An object of props to pass to the listbox option elements.
- `isExpandedClassName`: The class name applied to the listbox element if it is expanded.
- `isCollapsedClassName`: The class name applied to the listbox element if it is collapsed.
- `isExpandedStyle`: The inline style applied to the listbox element if it is expanded.
- `isCollapsedStyle`: The inline style applied to the listbox element if it is collapsed.
- `className`: The class name applied to the container element.
- ...: Any other properties you want to pass along to the container div element.

## Utilities

The following utilities are exported together with the DatalistInput component:

### Utilities used together with DatalistInput

- `startsWithValueFilter`: A default filter that filters the list of options by the input value.
- `useComboboxControls`: A hook to get the state and handlers for the input value and the dropdown expansion state.

### Utilities to implement a custom DatalistInput component

- `useComboboxHelpers`: A low-level hook, which returns a set of callbacks and event handlers for the DatalistInput component.
- `useFilters`: A hook that applies an array of filters to an array of items based on the current value.
- `useComboboxContext`: A low-level hook that returns the Combobox context value.
- `Combobox`: A low-level component which is wrapped by DatalistInput. It also acts as the Combobox ContextProvider.
- `Combobox.ComboboxInput`: A low-level component that provides the input field. It has to be wrapped by the Combobox component.
- `Combobox.Listbox`: A low-level component that provides the listbox. It has to be wrapped by the Combobox component.
- `Combobox.ListboxOption`: A low-level component that provides one listbox option. It has to be wrapped by the Combobox component.
- `Combobox.Highlight`: A low-level component that provides highlighting of the listbox option values based on the current input value. It has to be wrapped by the Combobox component.

## Types

The following types are exported from react-datalist-input and available for use in your components:

- `Filter`: A filter which can be added to the filters property of the DatalistInput component.
- `Item`: An item that can be added to the items property of the DatalistInput component.
- `DatalistInputProps`: The props accepted by the DatalistInput component.
- `ComboxboxProps`: The props accepted by the low-level Combobox component.
- `ComboboxInputProps`: The props accepted by the low-level ComboboxInput component.
- `ListboxProps`: The props accepted by the low-level Listbox component.
- `ListboxOptionProps`: The props accepted by the low-level ListboxOption component.
- `HighlightProps`: The props accepted by the low-level Highlight component.
- `useComoboxHelpersConfigParams`: The params for the low-level `useComboboxHelpers` hook.
