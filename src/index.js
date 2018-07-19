import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

class DataListInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            /* label of the last valid selection */
            lastValidSelect: "",
            /* current input text */
            currentInput: "",
            /* current set of matching items */
            matchingItems: [],
            /* visibility property of the drop down menu */
            visible: false,
            /* index of the currently focused item in the drop down menu */
            focusIndex: 0,
        };

        this.onHandleInput = this.onHandleInput.bind(this);
        this.match = this.match.bind(this);
        this.indexOfMatch = this.indexOfMatch.bind(this);
        this.onHandleKeydown = this.onHandleKeydown.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
    }

    /**
     * gets called when someone starts to write in the input field
     * @param event
     */
    onHandleInput(event){
        const currentInput = event.target.value;
        const matchingItems = this.props.items.filter((item) => {
            if (typeof(this.props.match) === typeof(Function))
                return this.props.match(currentInput, item);
            return this.match(currentInput, item);
        });
        this.setState({
            currentInput: currentInput,
            matchingItems: matchingItems,
            focusIndex: 0,
            visible: true,
        });
    }

    /**
     * default function for matching the current input value (needle) and the values of the items array
     * @param currentInput
     * @param item
     * @returns {boolean}
     */
    match(currentInput, item){
        return item.label.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase();
    }

    /**
     * function for getting the index of the currentValue inside a value of the values array
     * @param currentInput
     * @param item
     * @returns {number}
     */
    indexOfMatch(currentInput, item){
        return item.label.toUpperCase().indexOf(currentInput.toUpperCase());
    }

    /**
     * handle key events
     * @param event
     */
    onHandleKeydown(event){
        // only do something if drop-down div is visible
        if (!this.state.visible) return;
        let currentFocusIndex = this.state.focusIndex;
        if (event.keyCode === 40 || event.keyCode === 9) {
            // If the arrow DOWN key or tab is pressed increase the currentFocus variable:
            currentFocusIndex += 1;
            if (currentFocusIndex >= this.state.matchingItems.length) currentFocusIndex = 0;
            this.setState({
                focusIndex: currentFocusIndex,
            });
            // prevent tab to jump to the next input field if drop down is still open
            event.preventDefault();
        } else if (event.keyCode === 38) {
            // If the arrow UP key is pressed, decrease the currentFocus variable:
            currentFocusIndex -= 1;
            if (currentFocusIndex <= -1) currentFocusIndex = this.state.matchingItems.length - 1;
            this.setState({
                focusIndex: currentFocusIndex,
            });
        } else if (event.keyCode === 13) {
            // Enter pressed
            if (this.state.focusIndex > -1) {
                // Simulate a click on the "active" item:
                const selectedItem = this.state.matchingItems[currentFocusIndex];
                this.setState({
                    currentInput: selectedItem.label,
                    lastValidSelect: selectedItem.label,
                    visible: false,
                    focusIndex: -1,
                });
                this.props.onSelect(selectedItem.key);
            }
        }
    }


    /**
     * gets called when onClick happens on one of the list elements
     * @param event
     */
    onClickItem(event){
        // update the input value and close the dropdown again
        const selectedKey = event.currentTarget.children[1].value;
        const selectedLabel = this.state.matchingItems.find(item => item.key === selectedKey).label;
        this.setState({
            currentInput: selectedLabel,
            lastValidSelect: selectedLabel,
            visible: false,
            focusIndex: -1,
        });
        this.props.onSelect(selectedKey);
    }

    render() {
        const currentInput = this.state.currentInput;
        const items = this.state.matchingItems;

        const placeholder = this.props.placeholder;

        return (
            <div className="datalist-input">
                <input onKeyDown={this.onHandleKeydown} onInput={this.onHandleInput} type="text"
                       className="autocompleteInput"
                       placeholder={placeholder} value={currentInput}/>
                {(currentInput !== "" && this.state.visible &&
                    <div className={"datalist-items"}>
                        {items.map((item, i) => {
                            return (
                                <div onClick={this.onClickItem}
                                     className={this.state.focusIndex === i ? " datalist-active-item" : undefined}
                                     key={item.key}>
                                    {item.label.substr(0, this.indexOfMatch(currentInput, item))}
                                    <strong>{item.label.substr(this.indexOfMatch(currentInput, item), currentInput.length)}</strong>
                                    {item.label.substr(this.indexOfMatch(currentInput, item) + currentInput.length)}
                                    <input type='hidden' value={item.key}/>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    }
}

DataListInput.propTypes = {
    items: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    match: PropTypes.func
};

export default DataListInput;
