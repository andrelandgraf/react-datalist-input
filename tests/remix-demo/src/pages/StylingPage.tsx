import { DatalistInput } from "../../app/combobox";

const items = [
  { id: "Chocolate", value: "Chocolate" },
  { id: "Coconut", value: "Coconut" },
  { id: "Mint", value: "Mint" },
  { id: "Strawberry", value: "Strawberry" },
  { id: "Vanilla", value: "Vanilla" },
];

export function StylingPage() {
  return (
    <div className="demo-centered">
      <div style={{ width: "500px" }}>
        <DatalistInput
          label={<div>Custom Label</div>}
          placeholder="Chocolate"
          items={items}
          onSelect={(i) => console.log(i)}
          className="datalist"
          listboxProps={{ className: "datalist-list" }}
          inputProps={{ className: "datalist-input" }}
        />
      </div>
    </div>
  );
}
