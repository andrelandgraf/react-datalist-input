import { useCallback, useEffect, useState } from 'react';
import type { LinksFunction } from 'remix';
import { DatalistInput, useComboboxControls, Item, Filter, startsWithValueFilter } from '../combobox';

import comboboxStyles from '../combobox.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: comboboxStyles }];
};

const items = [
  { id: 'Chocolate', value: 'Chocolate' },
  { id: 'Coconut', value: 'Coconut' },
  { id: 'Mint', value: 'Mint' },
  { id: 'Strawberry', value: 'Strawberry' },
  { id: 'Vanilla', value: 'Vanilla' },
];

export default function Index() {
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: true });
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    // abitrary logic: close select after 3 selections
    if (selectedItems.length === 3) {
      setIsExpanded(false);
    }
  }, [selectedItems]);

  // filter displayed items based on previous selections
  const customFilter: Filter = useCallback(
    (options, value) => {
      return options.filter((o) => !selectedItems.find((s) => s.id === o.id));
    },
    [selectedItems],
  );

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        width: '100%',
        marginTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <h2>Selected:</h2>
      <ul>
        {selectedItems.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
      <div style={{ width: '500px' }}>
        <DatalistInput
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          value={value}
          setValue={setValue}
          onSelect={(item) => {
            if (selectedItems.length >= 3) setSelectedItems([item]);
            else setSelectedItems((prevItems) => [...prevItems, item]); // add the selected item to the list of selected items
            setValue(''); // clear the input value after selection
            setIsExpanded(true); // keep dropdown open after selection
          }}
          label="Select ice cream flavor"
          showLabel={false}
          items={items}
          filters={[customFilter, startsWithValueFilter]}
        />
      </div>
    </div>
  );
}
