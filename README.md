## Info

This package provides a single react component.The component contains an input field with a drop down menu to pick a possible option based on the current input as a react component.

Have a look at [w3schools.com](https://www.w3schools.com/howto/howto_js_autocomplete.asp) to see how you can do something similar with pure html, css, and js. For more information about react and the ecosystem see this [guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Demo

Check it out on [my personal website](https://andre-landgraf.cool/uses)!

## Feedback

Feel free to get inspired and more importantly please provide [your feedback](https://github.com/andrelandgraf/react-datalist-input/issues) on structure and style.

## Installation

### Installation via npm

```
npm install react-datalist-input --save
```

### Basic Usage

```
import DataListInput from 'react-datalist-input';

/**
 * OPTIONAL, this packages comes with a simple default label matching function
 * but feel free to create your own match algorithm if you want to do so
 * @param {String} currentInput (the current user input)
 * @param {object} item (one item of the items array)
 * @returns {boolean}
 */
matchCurrentInput = (currentInput, item) => {
    const yourLogic = item.someAdditionalValue;
    return (yourLogic.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase());
};

/**
 * your callback function gets called if the user selects one option out of the drop down menu
 * @param selectedItem object (the selected item / option)
 * @returns {*}
 */
onSelect = (selectedItem) => {
   this.doSomething(selectedItem);
};

render() {
    // the array you want to pass to the react-data-list component
    // each element at least needs a key and a label
    const items = myValues.map((item, i) => {
        return {
            // what to show to the user
            label: item.id  + ": " + item.name,
            // key to identify the item within the array
            key: item.id,
            // feel free to add your own app logic to access those properties in the onSelect function
            someAdditionalValue: item.someAdditionalValue,
            // or just keep everything
            ...item,
        }
    });

    return(
        <div>
            <DataListInput 
                placeholder={"Select an option from the drop down menu..."}
                items={items}
                onSelect={this.onSelect}
                match={this.matchCurrentInput}
            />
        </div>
);
```

## Properties

| Prop     |      Type      |  Required/Optional | Default Value
|----------|-------------   |------| ------|
| [items](#markdown-header-items) |  array  | required | - |
| [onSelect](#markdown-header-onSelect) |    function    |   required | -  |
| [match](#markdown-header-match) | function  |  optional | required | -  |
| [onDropdownOpen](#markdown-header-onDropdownOpen) | function  |  optional | -  |
| [onDropdownClose](#markdown-header-onDropdownClose) | function  |  optional | -  |
| [placeholder](#markdown-header-placeholder) | string  |  optional | ''  |
| [itemClassName](#markdown-header-itemClassName) | string  |  optional |  -  |
| [activeItemClassName](#markdown-header-activeItemClassName) | string  |  optional |  -  |
| [inputClassName](#markdown-header-inputClassName) | string  |  optional  | -  |
| [dropdownClassName](#markdown-header-dropdownClassName) | string  |  optional  | -  |
| [requiredInputLength](#markdown-header-requiredInputLength) | number  |  optional  | 0  |
| [clearInputOnSelect](#markdown-header-clearInputOnSelect) | boolean  |  optional  | false  |
| [suppressReselect](#markdown-header-suppressReselect) | boolean  |  optional  | true  |
| [dropDownLength](#markdown-header-dropDownLength) | number  |  optional  | infinite  |
| [initialValue](#markdown-header-initialValue) | string  |  optional  | -  |
| [debounceTime](#markdown-header-debounceTime) | number  |  optional  |  0  |
| [debounceLoader](#markdown-header-debounceLoader) | string  |  optional  | 'Loading...'  |
| [onInput](#markdown-header-onInput) | function  |  optional   | -  |

### <a name="markdown-header-items"></a>items

- <b>Required</b> property!
- The array of options for the drop down menu.<br>
- Every item inside the array needs to have following properties:
    - key : an id that identifies the item within the array
    - label: the label that will be shown in the drop down menu

### <a name="markdown-header-onSelect"></a>onSelect

- <b>Required</b> property!
- The callback function that will be called if the user selects one item of the drop down menu.
- Gets only called if the item changes. Selecting the same item twice will only trigger the function once (the first time).
- Parameter: (selectedKey)
    - selectedKey: the Key Property of the item that the user selected

### <a name="markdown-header-match"></a>match

- Pass a match function as stated above for creating your own matching algorithm for the autocomplete functionality.
- Parameter: (currentInput, item)
    - currentInput: String, the current user input typed into the input field
    - item: Object, the item of the items array (with key and label properties)

- Default:
```
/**
 * default function for matching the current input value (needle) and the values of the items array
 * @param currentInput String (the current user input)
 * @param item (one item of the items array)
 * @returns {boolean}
 */
match = (currentInput, item) => {
    return item.label.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase();
};
```

### <a name="markdown-header-onDropdownOpen"></a>onDropdownOpen

- The callback function that will be called after opening the drop down menu.

### <a name="markdown-header-onDropdownClose"></a>onDropdownClose

- The callback function that will be called after closing the drop down menu.

### <a name="markdown-header-placeholder"></a>placeholder

- The placeholder that will be shown inside the input field.
- Default is an empty string

### <a name="markdown-header-itemClassName"></a>itemClassName

- Additional classes to style each input field in the dropdown menu.
- Default is an empty string
- Removes the default styling if set

### <a name="markdown-header-activeItemClassName"></a>activeItemClassName

- Additional classes to style the active input field.
- Default is an empty string
- Removes the default styling if set

### <a name="markdown-header-inputClassName"></a>inputClassName

- Additional classes to style the input field.
- Default is an empty string
- Removes the default styling if set

### <a name="markdown-header-dropdownClassName"></a>dropdownClassName

- Additional classes to style the dropdown box.
- Default is an empty string
- Adds on the required styling (e.g. position:absolute)
- Removes the default styling if set

### <a name="markdown-header-requiredInputLength"></a>requiredInputLength

- Number to specify the threshold until when the dropdown menu should appear.
- Example `requiredInputLength=3`, only if the user input is longer than 2 characters, the dropdown menu will appear.
- Default is zero.

### <a name="markdown-header-clearInputOnSelect"></a>clearInputOnSelect

- Should the input field be cleared on select on filled with selected item?
- Default is false.

### <a name="markdown-header-suppressReselect"></a>suppressReselect

- If suppressReselect is set to false, selecting the same item again, it will trigger another onSelect callback call.
- Default is true.

### <a name="markdown-header-dropDownLength"></a>dropDownLength

- Only display the first `dropDownLength` matches in the dropdown. Useful if the array is really big.
- Number to specify max length of drop down.
- Default is Infinity.

### <a name="markdown-header-initialValue"></a>initialValue

- Specify an initial value for the input field.
- For example, `initialValue={'hello world'}` will print `hello world` into the input field on first render.
- Default is empty string.
- Caution: Don't confuse this with a placeholder (see placerholder prop), this is an actual value in the input
and supports uses cases like saving user state or suggesting a search value.

### <a name="markdown-header-debounceTime"></a>debounceTime

- Use `debounceTime` to define a debounce timeout time (in milliseconds) before the matching algorithm should be called
- New user input will trigger a new call to the debounce step and will clear every unresolved timeout
- For example, `debounceTime={1000}` will call the matching algorithm one second after the last user input
- This is useful if `items` is very large and/or the `match`-algorithm is doing some heavier operations
- `debounceTime` may improve the user experience by reducing lag times as it reduces the calls to the matching and rendering of the dropdown.
- Be careful, using too much debounceTime will slow down the response time of this component.
- If you still have performance issues even when using a `debounceTime={3000}` or higher, you might want to consider using another package / user input instead. Think about a "search/look-up"-button next to your input field or even consider running the search functionality in a dedicated backend.
- Default is zero which means no timeout/debouncing is used.


### <a name="markdown-header-debounceLoader"></a>debounceLoader

- Only in use if debounceTime is set
- Of type node which can be anything that react can render and will be shown as a loading bar
- Default is string "loading...".

### <a name="markdown-header-onInput"></a>onInput

- The callback function that will be called whenever the user types into the input field
- Exposing this function supports use cases like resetting states on empty input field


