import type { LinksFunction } from 'remix';
import { DatalistInput, useComboboxControls } from '../combobox';

import customStyles from '../custom.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: customStyles }];
};

const items = [
  { id: 'Chocolate', value: 'Chocolate' },
  { id: 'Coconut', value: 'Coconut' },
  { id: 'Mint', value: 'Mint' },
  { id: 'Strawberry', value: 'Strawberry' },
  { id: 'Vanilla', value: 'Vanilla' },
];

export default function Index() {
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: false });
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
          label={<div>Custom Label</div>}
          placeholder="Chocolate"
          items={items}
          onSelect={(i) => console.log(i)}
          className="datalist"
          listboxProps={{ className: 'datalist-list' }}
          inputProps={{ className: 'datalist-input' }}
        />
      </div>
    </div>
  );
}
