## Info

This package provides a single react component.

The component contains an input field with a drop down menu to pick a possible option based on the current input as a react component.

Following features describe and might distinguish the component from other npm packages that offer a similar react component:
<br>
- Hand over an array of options (items) with label and key properties
- Feel free to add additional properties to access those on selection within your callback function
- On selection the selected item will be passed to the callback function
- Define your own matching algorithm to restrict which options should be shown in the drop down menu based on the current user input
- Or do not pass an own matching algorithm and just use the default match function
- The current user input will be highlighted (bold) within each label in the drop down menu
- The callback function will be triggered only if the key property has changed since the last selection
- Selecting the same item twice in a row will trigger the callback function only once (on the first selection)

Have a look at [w3schools.com](https://www.w3schools.com/howto/howto_js_autocomplete.asp) to see how you can do the same thing with pure html, css, and js.

For more information about react and the ecosystem see this [guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Check it out yourself

Have a look at this [demo app](https://stark-retreat-79786.herokuapp.com/) using the react-datalist-input component. 
<br>The app is running on heroku for free, so I hope it is still up.

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

***placeholder***

- The placeholder that will be shown inside the input field. 
- Default is an empty string

***itemClassName***

- Additional classes to style each input field in the dropdown menu.
- Default is an empty string

***activeItemClassName***

- Additional classes to style the active input field.
- Default is an empty string

***inputClassName***

- Additional classes to style the input field.
- Default is an empty string

***requiredInputLength***

- Number to specify the threshold until when the dropdown menu should appear.
- Example `requiredInputLength=3`, only if the user input is longer than 2 characters, the dropdown menu will appear.
- Default is zero.

   
