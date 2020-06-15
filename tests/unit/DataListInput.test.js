import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DataListInput from '../../src/DataListInput';

const defaultProps = {
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
  onDropdownOpen: () => {},
  onDropdownClose: () => {},
  onInput: () => {},
};
const data = [
    {
      key: '0',
      label: 'Apple',
    },
    {
      key: '1',
      label: 'Mango',
    },
    {
      key: '2',
      label: 'Potatoe',
    },
];
const placeholder = 'Type something in here...';
const handleSelect = jest.fn();

describe('DataListInput', () => {

    test('renders without errors and sets default props correctly', () => {
        render(<DataListInput 
            items={data}
            onSelect={handleSelect}
            />
        );
        const datalistInput = screen.getByRole('textbox');
        expect(datalistInput).toHaveTextContent(defaultProps.initialValue);
        expect(datalistInput).toHaveAttribute('placeholder', defaultProps.placeholder);
        expect(datalistInput).toHaveAttribute('type', 'text');
    });

    test('renders input field with placeholder', () => {
      render(<DataListInput 
          items={data}
          placeholder={placeholder}
          onSelect={handleSelect}
          />
      );
      const datalistInput = screen.getByRole('textbox');
      expect(datalistInput).toHaveAttribute('placeholder', placeholder);
  });
});