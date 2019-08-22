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
        // onDropdownOpen?: () => void, // see https://github.com/andrelandgraf/react-datalist-input/pull/3
        // onDropdownClose?: () => void,
    }

    export default class DataListInput extends React.Component<DataListInputProperties> {

    }
}
