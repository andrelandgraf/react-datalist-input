import React from 'react';
import PropTypes from 'prop-types';

import './DataListInput.css';

class DataListInput extends React.Component {
    constructor( props ) {
        super( props );

        const { initialValue } = this.props;

        this.state = {
            /*  last valid item that was selected from the drop down menu */
            lastValidItem: undefined,
            /* current input text */
            currentInput: initialValue,
            /* current set of matching items */
            matchingItems: [],
            /* visibility property of the drop down menu */
            visible: false,
            /* index of the currently focused item in the drop down menu */
            focusIndex: 0,
            /* cleaner click events, click interaction within dropdown menu */
            interactionHappened: false,
            /* show loader if still matching in debounced mode */
            isMatchingDebounced: false,
        };

        /* to manage debouncing of matching, typing input into the input field */
        this.inputHappenedTimeout = undefined;

        window.addEventListener( 'click', this.onClickCloseMenu, false );
    }

    componentDidUpdate = () => {
        const { currentInput, visible, isMatchingDebounced } = this.state;
        const { initialValue } = this.props;

        // if we have an initialValue, we want to reset it everytime we update and are empty
        // also setting a new initialValue will trigger this
        if ( !currentInput && initialValue && !visible && !isMatchingDebounced ) {
            this.setState( { currentInput: initialValue } );
        }
    }

    componentWillUnmount = () => {
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
        if ( !input ) return;
        for ( let i = 0; i < input.length; i += 1 ) {
            const targetIsInput = event.target === input[ i ];
            const targetInInput = input[ i ].contains( event.target );
            if ( targetIsInput || targetInInput ) return;
        }

        // do not close menu if user clicked inside
        for ( let i = 0; i < menu.length; i += 1 ) {
            const targetInMenu = menu[ i ].contains( event.target );
            const targetIsMenu = event.target === menu[ i ];
            if ( targetInMenu || targetIsMenu ) return;
        }
        const { visible } = this.state;
        if ( visible ) {
            this.setState( { visible: false, focusIndex: -1 } );
        }
    }

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
     * matching process to find matching entries in items array
     * @param currentInput
     * @param item
     * @param match
     * @returns {Array}
     */
    matching = ( currentInput, items, match ) => items.filter( ( item ) => {
        if ( typeof ( match ) === typeof ( Function ) ) { return match( currentInput, item ); }
        return this.match( currentInput, item );
    } );

    /**
     * function for getting the index of the currentValue inside a value of the values array
     * @param currentInput
     * @param item
     * @returns {number}
     */
    indexOfMatch = ( currentInput, item ) => item
        .label.toUpperCase().indexOf( currentInput.toUpperCase() );

    indexOfItem = ( item, items ) => items.indexOf( items.find( i => i.key === item.key ) )

    /**
     * runs the matching process of the current input
     * and handles debouncing the different callback calls to reduce lag time
     * for bigger datasets or heavier matching algorithms
     * @param currentInput
     */
    debouncedMatchingUpdateStep = ( currentInput ) => {
        const { lastValidItem } = this.state;
        const {
            items, match, debounceTime, dropDownLength, requiredInputLength,
            clearInputOnSelect,
        } = this.props;
        // cleanup waiting update step
        if ( this.inputHappenedTimeout ) {
            clearTimeout( this.inputHappenedTimeout );
        }

        // set currentInput into input field and show loading if debounced mode is on
        const reachedRequiredLength = currentInput.length >= requiredInputLength;
        const showMatchingStillLoading = debounceTime >= 0 && reachedRequiredLength;
        this.setState( { currentInput, isMatchingDebounced: showMatchingStillLoading } );

        // no matching if we do not reach required input length
        if ( !reachedRequiredLength ) return;

        const updateMatchingItems = () => {
            console.log( 'starting' );
            const matchingItems = this.matching( currentInput, items, match );
            const displayableItems = matchingItems.slice( 0, dropDownLength );
            const showDragIndex = lastValidItem && !clearInputOnSelect;
            const index = showDragIndex ? this.indexOfItem( lastValidItem, displayableItems ) : 0;
            if ( matchingItems.length > 0 ) {
                console.log( 'finished' );
                this.setState( {
                    matchingItems: displayableItems,
                    focusIndex: index > 0 ? index : 0,
                    visible: true,
                    isMatchingDebounced: false,
                } );
            } else {
                this.setState( {
                    matchingItems: displayableItems,
                    visible: false,
                    focusIndex: -1,
                    isMatchingDebounced: false,
                } );
            }
        };

        if ( debounceTime <= 0 ) {
            updateMatchingItems();
        } else {
            this.inputHappenedTimeout = setTimeout( updateMatchingItems, debounceTime );
        }
    }

    /**
     * gets called when someone starts to write in the input field
     * @param value
     */
    onHandleInput = ( event ) => {
        const currentInput = event.target.value;
        this.debouncedMatchingUpdateStep( currentInput );
    };

    onClickInput = () => {
        const { visible } = this.state;
        let { currentInput } = this.state;
        const { requiredInputLength, initialValue } = this.props;

        // if user clicks on input field with initialValue,
        // the user most likely wants to clear the input field
        if ( initialValue && currentInput === initialValue ) {
            this.setState( { currentInput: '' } );
            currentInput = '';
        }

        const reachedRequiredLength = currentInput.length >= requiredInputLength;
        if ( reachedRequiredLength && !visible ) {
            this.debouncedMatchingUpdateStep( currentInput );
        }
    }

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
                selectedKey = elements[ i ].value;
                break;
            }
        }
        // key can either be number or string
        // eslint-disable-next-line eqeqeq
        const selectedItem = matchingItems.find( item => item.key == selectedKey );
        this.onSelect( selectedItem );
    };

    /**
     * onSelect is called onClickItem and onEnter upon an option of the drop down menu
     * does nothing if the key has not changed since the last onSelect event
     * @param selectedItem
     */
    onSelect = ( selectedItem ) => {
        const { suppressReselect, clearInputOnSelect } = this.props;
        const { lastValidItem, isMatchingDebounced } = this.state;
        // block select call until last matching went through
        if ( isMatchingDebounced ) return;
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

    renderMatchingLabel = ( currentInput, item, indexOfMatch ) => (
        <React.Fragment>
            {item.label.substr( 0, indexOfMatch ) }
            <strong>
                { item.label.substr( indexOfMatch, currentInput.length ) }
            </strong>
            { item.label.substr( indexOfMatch + currentInput.length, item.label.length ) }
        </React.Fragment>
    );

    renderItemLabel = ( currentInput, item, indexOfMatch ) => (
        <React.Fragment>
            { indexOfMatch >= 0 && currentInput.length
                ? this.renderMatchingLabel( currentInput, item, indexOfMatch )
                : item.label }
        </React.Fragment>
    )

    renderItems = (
        currentInput, items, focusIndex, activeItemClassName, itemClassName, dropdownClassName,
    ) => (
        <div className={`datalist-items ${ dropdownClassName || 'default-datalist-items' }`}>
            {items.map( ( item, i ) => {
                const isActive = focusIndex === i;
                const itemActiveClasses = isActive
                    ? `datalist-active-item ${ activeItemClassName || 'datalist-active-item-default' }` : '';
                const itemClasses = `${ itemClassName } ${ itemActiveClasses }`;
                return (
                    <div
                        onClick={this.onClickItem}
                        className={itemClasses}
                        key={item.key}
                        tabIndex={0}
                        role="button"
                        onKeyUp={event => event.preventDefault()}
                    >
                        {this.renderItemLabel(
                            currentInput, item, this.indexOfMatch( currentInput, item ),
                        )}
                        <input type="hidden" value={item.key} readOnly />
                    </div>
                );
            } )}
        </div>
    );

    renderLoader = ( debounceLoader, dropdownClassName, itemClassName ) => (
        <div className={`datalist-items ${ dropdownClassName || 'default-datalist-items' }`}>
            <div className={itemClassName}>{debounceLoader || 'loading...'}</div>
        </div>
    )

    renderInputField = ( placeholder, currentInput, inputClassName ) => (
        <input
            onChange={this.onHandleInput}
            onClick={this.onClickInput}
            onKeyDown={this.onHandleKeydown}
            type="text"
            className={`autocomplete-input ${ inputClassName }`}
            placeholder={placeholder}
            value={currentInput}
        />
    )

    render() {
        const {
            currentInput, matchingItems, focusIndex, visible, isMatchingDebounced,
        } = this.state;
        const {
            placeholder, inputClassName, activeItemClassName, itemClassName,
            requiredInputLength, dropdownClassName, debounceLoader,
        } = this.props;

        const reachedRequiredLength = currentInput.length >= requiredInputLength;

        let renderedResults;
        if ( reachedRequiredLength && isMatchingDebounced ) {
            renderedResults = this.renderLoader( debounceLoader, itemClassName, dropdownClassName );
        } else if ( reachedRequiredLength && visible ) {
            renderedResults = this.renderItems( currentInput, matchingItems, focusIndex,
                activeItemClassName, itemClassName, dropdownClassName );
        }
        return (
            <div className="datalist-input">
                { this.renderInputField( placeholder, currentInput, inputClassName ) }
                { renderedResults }
            </div>
        );
    }
}

DataListInput.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape( {
            label: PropTypes.string.isRequired,
            key: PropTypes.oneOfType( [
                PropTypes.string,
                PropTypes.number,
            ] ).isRequired,
        } ),
    ).isRequired,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
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
};

export default DataListInput;
