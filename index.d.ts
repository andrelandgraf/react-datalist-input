declare module 'react-datalist-input' {

    import * as React from 'react';

    export interface DataListInputItem {
        key: string | number;
        label: string;
    }

    export interface DataListInputProperties {
        items: DataListInputItem[];
        onSelect: (selectedItem: DataListInputItem) => void;
        match?: (currentInput: string, item: DataListInputItem) => boolean;
        placeholder?: string;
        itemClassName?: string;
        activeItemClassName?: string;
        inputClassName?: string;
        dropdownClassName?: string;
        requiredInputLength?: number;
        clearInputOnSelect?: boolean;
        suppressReselect?: boolean;
        dropDownLength?: number;
        initialValue?: string;
        onDropdownOpen?: () => void;
        onDropdownClose?: () => void;
        debounceTime?: number;
        debounceLoader?: React.ReactNode;
        onInput?: (inputValue: string) => void;
    }

    export default class DataListInput extends React.Component<DataListInputProperties> {

    }
}
