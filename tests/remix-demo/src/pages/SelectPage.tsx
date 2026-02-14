import { DatalistInput, useComboboxControls } from "../../app/combobox";

const items = [
  { id: "Chocolate", value: "Chocolate" },
  { id: "Coconut", value: "Coconut" },
  { id: "Mint", value: "Mint" },
  { id: "Strawberry", value: "Strawberry" },
  { id: "Vanilla", value: "Vanilla" },
];

export function SelectPage() {
  const { setValue, value } = useComboboxControls({ isExpanded: false });
  return (
    <div style={{ lineHeight: "1.4" }}>
      <h1>Transform DatalistInput into Select</h1>
      <DatalistInput
        value={value}
        setValue={setValue}
        onSelect={(item) => {
          setValue(item.value);
        }}
        label="Select ice cream flavor"
        items={items}
        filters={[(allItems) => allItems]}
        inputProps={{
          title: "Please select an ice cream flavor",
          required: true,
          pattern: `^(${items.map((i) => i.value).join("|")})$`,
          readOnly: true,
        }}
      />
    </div>
  );
}
