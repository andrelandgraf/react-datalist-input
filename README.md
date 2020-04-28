## Info

This package provides a single react component.

The component contains an input field with a drop down menu to pick a possible option based on the current input as a react component.

Have a look at [w3schools.com](https://www.w3schools.com/howto/howto_js_autocomplete.asp) to see how you can do something similar with pure html, css, and js.

For more information about react and the ecosystem see this [guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Feedback

Feel free to get inspired and more importantly please provide [your feedback](https://github.com/andrelandgraf/react-datalist-input/issues) on structure and style. I'm more than happy to learn how to improve my code and architecture.

## Installation

**Installation via npm**

```
npm install react-datalist-input --save
```

***Basic Usage***

```
import DataListInput from 'react-datalist-input';

/**
 * create your own match algorithm if you want to do so
 * @param currentInput String (the current user input)
 * @param item (one item of the items array)
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
    const items = this.props.values.map((item, i) => {
        return {
            // what to show to the user
            label: item.id  + ": " + item.name,
            // key to identify the item within the array
            key: item.id,
            // feel free to add your own app logic to access those properties later on
            someAdditionalValue: item.someAdditionalValue,
        }
    });

    return(
        <div>
            <DataListInput placeholder={"Select an option from the drop down menu..."}
                          items={items} onSelect={this.onSelect} match={this.matchCurrentInput}/>
        </div>
);
```

## Properties

***items***

- <b>Required</b> property!
- The array of options for the drop down menu.<br>
- Every item inside the array needs to have following properties:
    - key : an id that identifies the item within the array
    - label: the label that will be shown in the drop down menu

***onSelect***

- <b>Required</b> property!
- The callback function that will be called if the user selects one item of the drop down menu.
- Gets only called if the item changes. Selecting the same item twice will only trigger the function once (the first time).
- Parameter: (selectedKey)
    - selectedKey: the Key Property of the item that the user selected

***match***

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

***onDropdownOpen***

- The callback function that will be called after opening the drop down menu.

***onDropdownClose***

- The callback function that will be called after closing the drop down menu.

***placeholder***

- The placeholder that will be shown inside the input field.
- Default is an empty string

***itemClassName***

- Additional classes to style each input field in the dropdown menu.
- Default is an empty string
- Removes the default styling if set

***activeItemClassName***

- Additional classes to style the active input field.
- Default is an empty string
- Removes the default styling if set

***inputClassName***

- Additional classes to style the input field.
- Default is an empty string
- Removes the default styling if set

***dropdownClassName***

- Additional classes to style the dropdown box.
- Default is an empty string
- Adds on the required styling (e.g. position:absolute)
- Removes the default styling if set

***requiredInputLength***

- Number to specify the threshold until when the dropdown menu should appear.
- Example `requiredInputLength=3`, only if the user input is longer than 2 characters, the dropdown menu will appear.
- Default is zero.

***clearInputOnSelect***

- Should the input field be cleared on select on filled with selected item?
- Default is false.

***suppressReselect***

- If suppressReselect is set to false, selecting the same item again, it will trigger another onSelect callback call.
- Default is true.

***dropDownLength***

- Only display the first `dropDownLength` matches in the dropdown. Useful if the array is really big.
- Number to specify max length of drop down.
- Default is Infinity.

***initialValue***

- Specify an initial value for the input field.
- For example, `initialValue={'hello world'}` will print `hello world` into the input field on first render.
- Default is empty string.

***debounceTime***

- Use `debounceTime` to define a debounce timeout time (in milliseconds) before the matching algorithm should be called
- New user input will trigger a new call to the debounce step and will clear every unresolved timeout
- For example, `debounceTime={1000}` will call the matching algorithm one second after the last user input
- This is useful if `items` is very large and/or the `match`-algorithm is doing some heavier operations
- `debounceTime` may improve the user experience by reducing lag times as it reduces the calls to the matching and rendering of the dropdown.
- Be careful, using too much debounceTime will slow down the response time of this component.
- If you still have performance issues even when using a `debounceTime={3000}` or higher, you might want to consider using another package / user input instead. Think about a "search/look-up"-button next to your input field or even consider running the search functionality in a dedicated backend.
- Default is zero which means no timeout/debouncing is used.


***debounceLoader***

- Only in use if debounceTime is set
- Of type node which can be anything that react can render and will be shown as a loading bar
- Default is string "loading...".


