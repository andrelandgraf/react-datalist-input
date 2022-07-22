import { useMemo } from 'react';
import type { LinksFunction } from 'remix';
import { Item } from '../combobox';
import { DatalistInput, useComboboxControls } from '../combobox';

import comboboxStyles from '../combobox.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: comboboxStyles }];
};

type CustomItem = Item & {
  description: string;
};

const items: Array<CustomItem> = [
  { id: 'Chocolate', value: 'Chocolate', description: 'Chocolate is delicious' },
  { id: 'Coconut', value: 'Coconut', description: 'Coconut is tasty but watch your head!' },
  { id: 'Mint', value: 'Mint', description: 'Mint is a herb?' },
  { id: 'Strawberry', value: 'Strawberry', description: 'Strawberries are red' },
  { id: 'Vanilla', value: 'Vanilla', description: 'Vanilla is a flavor' },
];

const CustomItem = ({ item }: { item: CustomItem }) => {
  // already wrapped in <li></li>, so we don't have to do that here
  return (
    <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
      <b>{item.value}</b>
      <span>{item.description}</span>
    </div>
  );
};

export default function Index() {
  const customItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        node: <CustomItem item={item} />,
      })),
    [],
  );

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
          items={customItems}
          onSelect={(i) => console.log(i)}
        />
      </div>
    </div>
  );
}
