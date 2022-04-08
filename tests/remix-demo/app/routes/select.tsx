import type { LinksFunction } from 'remix';
import { DatalistInput, useComboboxControls } from '../combobox';

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

export default function Select() {
  const { setValue, value } = useComboboxControls({ isExpanded: false });
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Transform DatalistInput into Select</h1>
      <DatalistInput
        value={value}
        setValue={setValue}
        onSelect={(item) => {
          setValue(item.value);
        }}
        label="Select ice cream flavor"
        items={items}
        filters={[(items) => items]}
        inputProps={{
          title: 'Please select an ice cream flavor',
          required: true,
          pattern: `^(${items.map((i) => i.value).join('|')})$`,
          readOnly: true,
        }}
      />
    </div>
  );
}
