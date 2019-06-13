import React from 'react';
import PropTypes from 'prop-types';

import './DataListInput.css';

class DataListInput extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            /*  last valid item that was selected from the drop down menu */
            lastValidItem: undefined,
            /* current input text */
            currentInput: '',
            /* current set of matching items */
            matchingItems: [],
            /* visibility property of the drop down menu */
            visible: false,
            /* index of the currently focused item in the drop down menu */
            focusIndex: 0,
            /* cleaner click events */
            interactionHappened: false,
        };

        window.addEventListener( 'click', this.onClickCloseMenu, false );
    }

    componentWillUnmount = ()  => {
        window.removeEventListener( 'click', this.onClickCloseMenu );
    }

    onClickCloseMenu = ( event ) => {
        const menu = document.getElementsByClassName( 'datalist-items' );
        if ( !menu || !menu.length ) return;
        // if rerender, items inside might change, allow one click without further checking
        const { interactionHappened } = this.state;
        if ( interactionHappened ) {
            this.setState( { interactionHappened: false } );
            return;
        }
        // do not do anything if input is clicked, as we have a dedicated func for that
        const input = document.getElementsByClassName( 'autocomplete-input' );
        if( !input ) return;
        for( let i = 0; i < input.length; i+=1 ) {
            const targetIsInput = event.target === input[i];
            const targetInInput = input[i].contains( event.target );
            if ( targetIsInput || targetInInput ) return;
        }
        
        // do not close menu if user clicked inside
        for( let i = 0; i < menu.length; i+=1 ) {
            const targetInMenu = menu[ i ].contains( event.target );
            const targetIsMenu = event.target === menu[ i ];
            if ( targetInMenu || targetIsMenu ) return;
        }
        const { visible } = this.state;
        if ( visible ) {
            this.setState( { visible: false, focusIndex: -1 } );
        }
    }

    onClickInput = () => {
        const { currentInput, visible, lastValidItem } = this.state;
        const { requiredInputLength, dropDownLength, items, match, clearInputOnSelect } = this.props;
        const reachedRequiredLength = currentInput.length >= requiredInputLength;

        if ( reachedRequiredLength && !visible ) {

            const matchingItems = items.filter( ( item ) => {
                if ( typeof ( match ) === typeof ( Function ) ) { return match( currentInput, item ); }
                return this.match( currentInput, item );
            } );

            const currentInputIsLastItem = 
                !clearInputOnSelect && lastValidItem && lastValidItem.label === currentInput;
            const displayableItems = matchingItems.length && !currentInputIsLastItem
                ? matchingItems : items.slice( 0, dropDownLength );

            let index = lastValidItem && !clearInputOnSelect
                ? this.indexOfItem( lastValidItem, displayableItems ) : 0;
            index = index > 0 ? index : 0;

            this.setState( { visible: true, matchingItems: displayableItems, focusIndex: index, } );
        }
    }

    /**
     * gets called when someone starts to write in the input field
     * @param value
     */
    onHandleInput = ( event ) => {
        const currentInput = event.target.value;
        const { items, match, dropDownLength } = this.props;
        const matchingItems = items.filter( ( item ) => {
            if ( typeof ( match ) === typeof ( Function ) ) { return match( currentInput, item ); }
            return this.match( currentInput, item );
        } );
        const displayableItems = matchingItems.slice( 0, dropDownLength );
        if( matchingItems.length > 0) {
            this.setState( {
                currentInput,
                matchingItems: displayableItems,
                focusIndex: 0,
                visible: true,
            } );
        } else {
            this.setState( { 
                currentInput,
                matchingItems: displayableItems,
                visible: false,
                focusIndex: -1,
            } ) 
        }
    };

    /**
     * default function for matching the current input value (needle)
     * and the values of the items array
     * @param currentInput
     * @param item
     * @returns {boolean}
     */
    match = ( currentInput, item ) => item
        .label.substr( 0, currentInput.length ).toUpperCase() === currentInput.toUpperCase();

    /**
     * function for getting the index of the currentValue inside a value of the values array
     * @param currentInput
     * @param item
     * @returns {number}
     */
    indexOfMatch = ( currentInput, item ) => item
        .label.toUpperCase().indexOf( currentInput.toUpperCase() );

    indexOfItem = ( item, items ) => items.indexOf( items.find( i => i.id === item.id ) )

    /**
     * handle key events
     * @param event
     */
    onHandleKeydown = ( event ) => {
        const { visible, focusIndex, matchingItems } = this.state;
        // only do something if drop-down div is visible
        if ( !visible ) return;
        let currentFocusIndex = focusIndex;
        if ( event.keyCode === 40 || event.keyCode === 9 ) {
            // If the arrow DOWN key or tab is pressed increase the currentFocus variable:
            currentFocusIndex += 1;
            if ( currentFocusIndex >= matchingItems.length ) currentFocusIndex = 0;
            this.setState( {
                focusIndex: currentFocusIndex,
            } );
            // prevent tab to jump to the next input field if drop down is still open
            event.preventDefault();
        } else if ( event.keyCode === 38 ) {
            // If the arrow UP key is pressed, decrease the currentFocus variable:
            currentFocusIndex -= 1;
            if ( currentFocusIndex <= -1 ) currentFocusIndex = matchingItems.length - 1;
            this.setState( {
                focusIndex: currentFocusIndex,
            } );
        } else if ( event.keyCode === 13 ) {
            // Enter pressed, similar to onClickItem
            if ( focusIndex > -1 ) {
                // Simulate a click on the "active" item:
                const selectedItem = matchingItems[ currentFocusIndex ];
                this.onSelect( selectedItem );
            }
        }
    };

    /**
     * onClickItem gets called when onClick happens on one of the list elements
     * @param event
     */
    onClickItem = ( event ) => {
        const { matchingItems } = this.state;
        // update the input value and close the dropdown again
        const elements = event.currentTarget.children;
        let selectedKey;
        for ( let i = 0; i < elements.length; i += 1 ) {
            if ( elements[ i ].tagName === 'INPUT' ) {
                selectedKey = Number( elements[ i ].value );
                break;
            }
        }
        const selectedItem = matchingItems.find( item => item.key === selectedKey );
        this.onSelect( selectedItem );
    };

    /**
     * onSelect is called onClickItem and onEnter upon an option of the drop down menu
     * does nothing if the key has not changed since the last onSelect event
     * @param selectedItem
     */
    onSelect = ( selectedItem ) => {
        const { suppressReselect, clearInputOnSelect } = this.props;
        const { lastValidItem } = this.state;
        if ( suppressReselect && lastValidItem && selectedItem.key === lastValidItem.key ) {
            // do not trigger the callback function
            // but still change state to fit new selection
            this.setState( {
                currentInput: clearInputOnSelect ? '' : selectedItem.label,
                visible: false,
                focusIndex: -1,
                interactionHappened: true,
            } );
            return;
        }
        // change state to fit new selection
        this.setState( {
            currentInput: clearInputOnSelect ? '' : selectedItem.label,
            lastValidItem: selectedItem,
            visible: false,
            focusIndex: -1,
            interactionHappened: true,
        } );
        // callback function onSelect
        const { onSelect } = this.props;
        onSelect( selectedItem );
    };

    renderMatchingLabel = ( currentInput, item ) => (
        <React.Fragment>
            {item.label.substr( 0, this.indexOfMatch( currentInput, item ) ) }
            <strong>
                { item.label.substr( this.indexOfMatch( currentInput, item ), currentInput.length ) }
            </strong>
            { item.label.substr( this.indexOfMatch( currentInput, item ) + currentInput.length ) }
        </React.Fragment>
    );

    renderItemLabel = ( currentInput, item ) => (
        <React.Fragment>
            { this.indexOfMatch( currentInput, item ) > 0
                ? this.renderMatchingLabel( currentInput, item )
                : item.label }
        </React.Fragment>
    )

    renderItems = ( currentInput, items, focusIndex, activeItemClassName, itemClassName ) => (
        <div className="datalist-items">
            {items.map( ( item, i ) => {
                const isActive = focusIndex === i;
                const itemActiveClasses = isActive ? `datalist-active-item ${ activeItemClassName }` : '';
                const itemClasses = `${ itemClassName } ${ itemActiveClasses };`;
                return (
                    <div
                        onClick={this.onClickItem}
                        className={itemClasses}
                        key={item.key}
                        tabIndex={0}
                        role="button"
                        onKeyUp={event => event.preventDefault()}
                    >
                        { this.renderItemLabel( currentInput, item )}
                        <input type="hidden" value={item.key} readOnly />
                    </div>
                );
            } )}
        </div>
    );

    renderInputField = ( placeholder, currentInput, inputClassName ) => (
        <input
            onChange={this.onHandleInput}
            onClick={ this.onClickInput }
            onKeyDown={this.onHandleKeydown}
            type="text"
            className={`autocomplete-input ${ inputClassName }`}
            placeholder={placeholder}
            value={currentInput}
        />
    )

    render() {
        const {
            currentInput, matchingItems, focusIndex, visible,
        } = this.state;
        const {
            placeholder, inputClassName, activeItemClassName, itemClassName, requiredInputLength,
        } = this.props;
        const reachedRequiredLength = currentInput.length >= requiredInputLength;
        return (
            <div className="datalist-input">
                { this.renderInputField( placeholder, currentInput, inputClassName ) }
                { reachedRequiredLength && visible
                    && this.renderItems( currentInput, matchingItems, focusIndex,
                        activeItemClassName, itemClassName )
                }
            </div>
        );
    }
}

DataListInput.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape( {
            label: PropTypes.string.isRequired,
            key: PropTypes.number.isRequired,
        } ),
    ).isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    match: PropTypes.func,
    inputClassName: PropTypes.string,
    itemClassName: PropTypes.string,
    activeItemClassName: PropTypes.string,
    requiredInputLength: PropTypes.number,
    clearInputOnSelect: PropTypes.bool,
    suppressReselect: PropTypes.bool,
    dropDownLength: PropTypes.number,
};

DataListInput.defaultProps = {
    placeholder: '',
    match: undefined,
    inputClassName: '',
    itemClassName: '',
    activeItemClassName: '',
    requiredInputLength: 0,
    clearInputOnSelect: false,
    suppressReselect: true,
    dropDownLength: Infinity,
};

export default DataListInput;
