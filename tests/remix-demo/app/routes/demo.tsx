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

export default function Index() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        width: '100%',
        marginTop: '10vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '500px' }}>
        <DatalistInput
          label="Select your favorite flavor"
          placeholder="Chocolate"
          items={items}
          onSelect={(i) => console.log(i)}
        />
      </div>
    </div>
  );
}
