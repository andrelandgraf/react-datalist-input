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
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: false });
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Demo</h1>
      <h2>Plain/Native Datalist Element</h2>
      <label htmlFor="ice-cream-choice">Choose a flavor:</label>
      <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
      <datalist id="ice-cream-flavors" style={{ display: 'block' }}>
        <option value="Chocolate" />
        <option value="Coconut" />
        <option value="Mint" />
        <option value="Strawberry" />
        <option value="Vanilla" />
      </datalist>
      <hr />
      <h2>Autocomplete & Require: react-datalist-input with require on value of datalist</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert(`You selected ${value}`);
        }}
        style={{ width: '30vw' }}
      >
        <DatalistInput
          value={value}
          setValue={setValue}
          onSelect={(item) => {
            setValue(item.value);
            setIsExpanded(false);
          }}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          label="Select ice cream flavor"
          showLabel={false}
          items={items}
          inputProps={{
            title: 'Please select an ice cream flavor',
            required: true,
            pattern: `^(${items.map((i) => i.value).join('|')})$`,
          }}
          highlightProps={{
            as: 'span',
            className: 'highlighted-text',
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
