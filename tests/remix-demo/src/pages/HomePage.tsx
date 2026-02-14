import { DatalistInput, useComboboxControls } from "../../app/combobox";

const items = [
  { id: "Chocolate", value: "Chocolate" },
  { id: "Coconut", value: "Coconut" },
  { id: "Mint", value: "Mint" },
  { id: "Strawberry", value: "Strawberry" },
  { id: "Vanilla", value: "Vanilla" },
];

export function HomePage() {
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: false });

  return (
    <div style={{ lineHeight: "1.4" }}>
      <h2>Plain/Native datalist</h2>
      <label htmlFor="ice-cream-choice">Choose a flavor:</label>
      <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
      <datalist id="ice-cream-flavors" style={{ display: "block" }}>
        <option value="Chocolate" />
        <option value="Coconut" />
        <option value="Mint" />
        <option value="Strawberry" />
        <option value="Vanilla" />
      </datalist>
      <hr />
      <h2>react-datalist-input (required + autocomplete)</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert(`You selected ${value}`);
        }}
        style={{ width: "30vw", minWidth: 320 }}
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
            title: "Please select an ice cream flavor",
            required: true,
            pattern: `^(${items.map((i) => i.value).join("|")})$`,
          }}
          highlightProps={{
            as: "span",
            className: "highlighted-text",
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
