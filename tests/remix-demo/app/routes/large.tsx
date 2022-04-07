import type { LinksFunction } from 'remix';
import { DatalistInput, useComboboxControls } from '../combobox';

import comboboxStyles from '../combobox.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: comboboxStyles }];
};

const items = new Array(1000).fill(0).map((_, index) => ({
  id: `${index}`,
  value: `value ${index}`,
}));

export default function Index() {
  console.log(items);
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
          listboxProps={{
            style: { maxHeight: '300px', overflowY: 'scroll' },
          }}
        />
      </div>
    </div>
  );
}
