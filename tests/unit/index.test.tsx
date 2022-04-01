import React, { useCallback, useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatalistInput, { startsWithValueFilter } from '../../src/index';
import type { Filter, Item } from '../../src/index';

const label = 'Pick your favorite grocery';
const data = [
  {
    id: '0',
    value: 'Apple',
  },
  {
    id: '1',
    value: 'Mango',
  },
  {
    id: '2',
    value: 'Potatoe',
  },
  {
    id: '3',
    value: 'Pear',
  },
  {
    id: '4',
    value: 'Peach',
  },
  {
    id: '5',
    value: 'Cherry',
  },
  {
    id: '6',
    value: 'Grapes',
  },
  {
    id: '7',
    value: 'Watermelon',
  },
  {
    id: '8',
    value: 'Lime',
  },
  {
    id: '9',
    value: 'Peumo',
  },
];
const placeholder = 'Type something in here...';

describe('DatalistInput', () => {
  test('renders without errors and sets default props correctly', () => {
    const { container } = render(<DatalistInput label={label} items={data} />);
    const wrapper = container.querySelector('.react-datalist-input__container');
    expect(wrapper).toBeDefined();
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('');
    expect(input.type).toBe('text');
    const listbox = container.querySelector('react-datalist-input__listbox');
    expect(listbox).toBe(null);
    const dropDownItems = container.querySelectorAll('li');
    expect(dropDownItems.length).toBe(0);
  });

  test('renders without errors and sets props correctly', () => {
    const { container } = render(
      <DatalistInput label={label} value="Initial Value" placeholder={placeholder} items={data} />,
    );
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;
    expect(input.value).toBe('Initial Value');
    expect(input.placeholder).toBe(placeholder);
  });

  test('renders input field with label if showLabel is set to true', () => {
    const { container } = render(<DatalistInput label={label} items={data} />);
    const htmlLabel = container.querySelector('label');
    expect(htmlLabel).toBeDefined();
    if (!htmlLabel) return;

    expect(htmlLabel.textContent).toBe(label);
  });

  test('renders input field with aria-label if showLabel is set to false', () => {
    const { container } = render(<DatalistInput showLabel={false} label={label} items={data} />);
    const htmlLabel = container.querySelector('label');
    expect(htmlLabel).toBe(null);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;
    expect(input.getAttribute('aria-label')).toBe(label);
  });

  test('renders right items into dropdown with default filter function', async () => {
    const { container } = render(<DatalistInput label={label} items={data} />);

    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;
    fireEvent.click(input);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(data.length);
    fireEvent.change(input, { target: { value: 'Pe' } });
    const matchingItems = container.querySelectorAll('li');
    expect(matchingItems.length).toBe(3);
  });

  test('renders only 2 items slicing custom filter', async () => {
    const FC = () => {
      const limitOptionsFilter: Filter = useCallback((options, value) => options.slice(0, 2), []);
      return <DatalistInput label={label} items={data} filters={[startsWithValueFilter, limitOptionsFilter]} />;
    };
    const { container } = render(<FC />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(2);
    fireEvent.change(input, { target: { value: 'Pe' } });
    const matchingItems = container.querySelectorAll('li');
    expect(matchingItems.length).toBe(2);
    fireEvent.change(input, { target: { value: 'Peac' } });
    const matchingItemsNext = container.querySelectorAll('li');
    expect(matchingItemsNext.length).toBe(1);
  });

  test('initial value: renders matching items with value', async () => {
    const { container } = render(<DatalistInput label={label} items={data} value="Pea" />);

    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    expect(input.value).toBe('Pea');
    const matchingItems = container.querySelectorAll('li');
    expect(matchingItems.length).toBe(2);
  });

  test('input value updates correctly on select', async () => {
    const { container } = render(<DatalistInput label={label} items={data} />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'Apple' } });
    const appleItem = container.querySelector('li');
    expect(appleItem).toBeDefined();
    if (!appleItem) return;
    expect(appleItem).toBeDefined();
    if (!appleItem) return;

    fireEvent.click(appleItem);
    expect(input.value).toBe('Apple');
  });

  test('custom behavior: clear input on click', async () => {
    const FC = () => {
      const [value, setValue] = useState('Pea');
      return (
        <DatalistInput
          label={label}
          items={data}
          value={value}
          setValue={setValue}
          inputProps={{
            onClick: () => {
              setValue('');
            },
          }}
        />
      );
    };
    const { container } = render(<FC />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    expect(input.value).toBe('');
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(data.length);
  });

  test('custom behavior: clear input on select', async () => {
    const FC = () => {
      const [value, setValue] = useState('');
      return (
        <DatalistInput
          label={label}
          items={data}
          value={value}
          setValue={setValue}
          onSelect={() => {
            setValue('');
          }}
        />
      );
    };
    const { container } = render(<FC />);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    fireEvent.change(input, { target: { value: 'Apple' } });

    expect(input.value).toBe('Apple');

    const appleItem = container.querySelector('li');
    expect(appleItem).toBeDefined();
    if (!appleItem) return;

    fireEvent.click(appleItem);
    expect(input.value).toBe('');
  });

  test('calls lifecycle functions correctly', async () => {
    const handleSelect = jest.fn();
    const onChange = jest.fn();
    const onClick = jest.fn();
    const setValue = jest.fn();
    const setIsExpanded = jest.fn();

    const FC = () => {
      const setValueFc = (str: string) => {
        setValue(str);
      };
      const setIsExpandedFc = (bool: boolean) => {
        setIsExpanded(bool);
      };
      const handleSelectFc = (item: Item) => {
        handleSelect(item);
      };
      const onChangeFc = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange();
      };
      const onClickFc = (e: React.MouseEvent<HTMLInputElement>) => {
        onClick();
      };
      return (
        <DatalistInput
          label={label}
          items={data}
          setValue={setValueFc}
          setIsExpanded={setIsExpandedFc}
          onSelect={handleSelectFc}
          onChange={onChangeFc}
          inputProps={{ onClick: onClickFc }}
        />
      );
    };
    const { container } = render(<FC />);
    expect(handleSelect).toBeCalledTimes(0);
    expect(onClick).toBeCalledTimes(0);
    expect(setValue).toBeCalledTimes(0);
    expect(setIsExpanded).toBeCalledTimes(0);
    expect(onChange).toBeCalledTimes(0);

    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    expect(handleSelect).toBeCalledTimes(0);
    expect(onClick).toBeCalledTimes(1);
    fireEvent.change(input, { target: { value: 'Apple' } });
    expect(handleSelect).toBeCalledTimes(0);
    expect(setValue).toBeCalledTimes(1);
    expect(setValue).toBeCalledWith('Apple');
    expect(setIsExpanded).toBeCalledTimes(2);
    expect(setIsExpanded).toBeCalledWith(true);
    expect(onChange).toBeCalledTimes(1);
    expect(onClick).toBeCalledTimes(1);

    const appleItem = container.querySelector('li');
    expect(appleItem).toBeDefined();
    if (!appleItem) return;
    fireEvent.click(appleItem);
    expect(handleSelect).toBeCalledTimes(1);
    expect(handleSelect).toBeCalledWith(data[0]);
    expect(setValue).toBeCalledTimes(1);
    expect(setIsExpanded).toBeCalledTimes(3);
    expect(setIsExpanded).toBeCalledWith(false);
    expect(onChange).toBeCalledTimes(1);
    expect(onClick).toBeCalledTimes(1);
  });

  test('click outside menu closes menu', async () => {
    const { container } = render(<DatalistInput label={label} items={data} />);
    let liElements = container.querySelectorAll('li');
    expect(liElements.length).toBe(0);
    const input = container.querySelector('input');
    expect(input).toBeDefined();
    if (!input) return;

    fireEvent.click(input);
    liElements = container.querySelectorAll('li');
    expect(liElements.length).toBe(data.length);
    fireEvent.click(document.body);
    liElements = container.querySelectorAll('li');
    expect(liElements.length).toBe(0);
  });
});
