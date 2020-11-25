import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
  queryByRole,
  queryAllByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
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
  clearInputOnClick: false,
  suppressReselect: true,
  dropDownLength: Infinity,
  value: undefined,
  debounceTime: 0,
  debounceLoader: undefined,
  onDropdownOpen: () => {},
  onDropdownClose: () => {},
  onInput: () => {},
  onClick: () => {},
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
  {
    key: '3',
    label: 'Pear',
  },
  {
    key: '4',
    label: 'Peach',
  },
  {
    key: '5',
    label: 'Cherry',
  },
  {
    key: '6',
    label: 'Grapes',
  },
  {
    key: '7',
    label: 'Watermelon',
  },
  {
    key: '8',
    label: 'Lime',
  },
  {
    key: '9',
    label: 'Peumo',
  },
];
const placeholder = 'Type something in here...';
const customMatch = (currentInput, item) =>
  item.label.toLowerCase().includes(currentInput);
const handleSelect = jest.fn();
const onDropdownOpen = jest.fn();
const onDropdownClose = jest.fn();
const onInput = jest.fn();
const onClick = jest.fn();

describe('DataListInput', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders without errors and sets default props correctly', () => {
    render(<DataListInput items={data} onSelect={handleSelect} />);
    const datalistInput = screen.getByRole('textbox');
    expect(datalistInput).toHaveTextContent('');
    expect(datalistInput).toHaveAttribute(
      'placeholder',
      defaultProps.placeholder
    );
    expect(datalistInput).toHaveAttribute('type', 'text');
  });

  test('renders input field with placeholder', () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    expect(datalistInput).toHaveAttribute('placeholder', placeholder);
  });

  test('renders right items into dropdown with default match function', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(data.length);
    fireEvent.change(datalistInput, { target: { value: 'Pe' } });
    const matchingItems = await screen.getAllByRole('button');
    expect(matchingItems.length).toBe(3);
  });

  test('renders only dropDownLength items', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        dropDownLength={2}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(2);
    fireEvent.change(datalistInput, { target: { value: 'Pe' } });
    const matchingItems = await screen.getAllByRole('button');
    expect(matchingItems.length).toBe(2);
  });

  test('renders only if requiredInputLength reached', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        dropDownLength={2}
        requiredInputLength={3}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.queryAllByRole('button');
    expect(items.length).toBe(0);
    fireEvent.change(datalistInput, { target: { value: 'Pe' } });
    const matchingButInvisible = await screen.queryAllByRole('button');
    expect(matchingButInvisible.length).toBe(0);
    fireEvent.change(datalistInput, { target: { value: 'Pea' } });
    const matchingItems = await screen.getAllByRole('button');
    expect(matchingItems.length).toBe(2);
  });

  test('clearInputOnClick: renders matching items with value', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Pea"
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(2);
  });

  test('clearInputOnClick: renders matching items without value', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Pea"
        clearInputOnClick
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(data.length);
  });

  test('clearInputOnSelect: removes value if set', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        clearInputOnSelect
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    fireEvent.change(datalistInput, { target: { value: 'Apple' } });
    const appleItem = await screen.getByRole('button');
    fireEvent.click(appleItem);
    expect(datalistInput).toHaveAttribute('value', '');
  });

  test('clearInputOnSelect: keeps value if false', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Apple"
        clearInputOnSelect={false} // default value
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    fireEvent.change(datalistInput, { target: { value: 'Apple' } });
    const appleItem = await screen.getByRole('button');
    fireEvent.click(appleItem);
    expect(datalistInput).toHaveAttribute('value', 'Apple');
  });

  test('clearInputOnSelect: clear input on select does not work if value is set', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Apple"
        clearInputOnSelect
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const appleItem = await screen.getByRole('button');
    fireEvent.click(appleItem);
    expect(datalistInput).toHaveAttribute('value', 'Apple');
  });

  test('renders matching items with custom matching func', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        match={customMatch}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(data.length);
    fireEvent.change(datalistInput, { target: { value: 'ap' } });
    const matchingItems = await screen.getAllByRole('button');
    expect(matchingItems.length).toBe(2);
  });

  test('calls lifecycle functions correctly', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        onDropdownOpen={onDropdownOpen}
        onDropdownClose={onDropdownClose}
        onInput={onInput}
        onClick={onClick}
      />
    );
    expect(handleSelect).toBeCalledTimes(0);
    expect(onDropdownOpen).toBeCalledTimes(0);
    expect(onDropdownClose).toBeCalledTimes(0);
    expect(onInput).toBeCalledTimes(0);
    expect(onClick).toBeCalledTimes(0);
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    await screen.getAllByRole('button');
    expect(handleSelect).toBeCalledTimes(0);
    expect(onDropdownOpen).toBeCalledTimes(1);
    expect(onDropdownClose).toBeCalledTimes(0);
    expect(onInput).toBeCalledTimes(0);
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith('');
    fireEvent.change(datalistInput, { target: { value: 'Apple' } });
    const appleItem = await screen.getByRole('button');
    expect(handleSelect).toBeCalledTimes(0);
    expect(onDropdownOpen).toBeCalledTimes(1);
    expect(onDropdownClose).toBeCalledTimes(0);
    expect(onInput).toBeCalledTimes(1);
    expect(onInput).toBeCalledWith('Apple');
    expect(onClick).toBeCalledTimes(1);
    fireEvent.click(appleItem);
    expect(handleSelect).toBeCalledTimes(1);
    expect(onDropdownOpen).toBeCalledTimes(1);
    expect(onDropdownClose).toBeCalledTimes(1);
    expect(onInput).toBeCalledTimes(1);
    expect(onClick).toBeCalledTimes(1);
  });

  test('click outside menu closes menu', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        onDropdownClose={onDropdownClose}
        onDropdownOpen={onDropdownOpen}
      />
    );
    expect(onDropdownClose).toBeCalledTimes(0);
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    await screen.getAllByRole('button');
    expect(onDropdownClose).toBeCalledTimes(0);
    fireEvent.change(datalistInput, { target: { value: 'Pe' } });
    const matchingItems = await screen.getAllByRole('button');
    expect(matchingItems.length).toBe(3);
    expect(onDropdownClose).toBeCalledTimes(0);
    fireEvent.click(document.body);
    expect(onDropdownClose).toBeCalledTimes(1);
    expect(screen.queryAllByRole('button')).toEqual([]);
  });

  test('renders the same html based on the same inputs', async () => {
    render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
      />
    );
    expect(document.body).toMatchSnapshot();
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    await screen.getAllByRole('button');
    expect(document.body).toMatchSnapshot();
    fireEvent.change(datalistInput, { target: { value: 'Pe' } });
    await screen.getAllByRole('button');
    expect(document.body).toMatchSnapshot();
    fireEvent.click(document.body);
    expect(document.body).toMatchSnapshot();
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    fireEvent.click(items[0]);
    expect(document.body).toMatchSnapshot();

    fireEvent.click(datalistInput);
    await screen.getAllByRole('button');
    expect(document.body).toMatchSnapshot();
  });

  test('custom value prop: renders value after setting value empty to clear input field', async () => {
    const runtime = render(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value={undefined}
      />
    );
    const datalistInput = screen.getByRole('textbox');
    fireEvent.click(datalistInput);
    const items = await screen.getAllByRole('button');
    expect(items.length).toBe(data.length);
    fireEvent.change(datalistInput, { target: { value: 'Apple' } });
    expect(datalistInput).toHaveAttribute('value', 'Apple');
    expect(document.body).toMatchSnapshot();

    // we don't update currentInput since the dropdown is visible
    runtime.rerender(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Peach"
      />
    );
    expect(document.body).toMatchSnapshot();

    const appleItem = await screen.getByRole('button');
    fireEvent.click(appleItem);
    expect(handleSelect).toBeCalledTimes(1);

    // !!! now we have Peach since the props gave Peach, even though the user selected Apple
    expect(datalistInput).toHaveAttribute('value', 'Peach');
    expect(document.body).toMatchSnapshot();

    // now we change to Apple
    runtime.rerender(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value="Apple"
      />
    );
    expect(datalistInput).toHaveAttribute('value', 'Apple');
    expect(document.body).toMatchSnapshot();

    // context outside component changed, we want to clear the value
    runtime.rerender(
      <DataListInput
        items={data}
        placeholder={placeholder}
        onSelect={handleSelect}
        value=""
      />
    );
    expect(datalistInput).toHaveAttribute('value', '');
    expect(document.body).toMatchSnapshot();
  });
});
