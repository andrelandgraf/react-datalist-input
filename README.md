## Info

This package provides an input field with a drop-down menu react component.

The component contains an input field with a drop down menu to pick a possible option based on the current input as a react component. 

Have a look at [w3schools.com](https://www.w3schools.com/howto/howto_js_autocomplete.asp) to see how you can do the same thing with pure html, css, and js.

For more information about react and the ecosystem see this [guide](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Check it out yourself

Have a look at this [demo app](https://stark-retreat-79786.herokuapp.com/) using the react-datalist-input component. 
<br>It is running free on heroku, so sorry if it is down already. 

## Feedback
Feel free to get inspired and more importantly provide [your feedback](https://github.com/andrelandgraf/react-datalist-input/issues) on structure and style. I'm more than happy to learn how to improve my code and architecture.

## Installation

**Install node dependencies**

```
npm install react-datalist-input --save
```

***Basic Usage***

```
import DataListInput from 'react-datalist-input';

// create your own match algorithm if you want to
matchCurrentInput = (currentInput, item) => {
    const key = item.someAdditionalValue;
    return (key.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase());
     
};

// callback function
// gets called if the user selects one option out of the drop down menu
onSelect = (selectedKey) => {
    if (this.props.currentSymbol !== selectedKey)
        this.props.onChangeSymbol(selectedKey);
};

render() {
    // the array you want to pass to the react-data-list component
    // each element needs a key (id) and a label (what to show to the user)
    const items = this.props.values.map((item, i) => {
        return {
            label: item.id  + ": " + item.name,
            key: item.id,
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
 * @param currentInput
 * @param item
 * @returns {boolean}
 */
match = (currentInput, item) => {
    return item.label.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase();
};
```

***placeholder***

- The placeholder that will be shown inside the input field. 

   