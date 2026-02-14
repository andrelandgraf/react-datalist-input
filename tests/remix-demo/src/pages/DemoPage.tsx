import { DatalistInput } from "../../app/combobox";

const items = [
  { id: "Chocolate", value: "Chocolate" },
  { id: "Coconut", value: "Coconut" },
  { id: "Mint", value: "Mint" },
  { id: "Strawberry", value: "Strawberry" },
  { id: "Vanilla", value: "Vanilla" },
];

export function DemoPage() {
  return (
    <div className="demo-centered">
      <div style={{ width: "500px" }}>
        <DatalistInput
          label="Select your favorite flavor"
          placeholder="Chocolate"
          items={items}
          onSelect={(i) => console.log(i)}
          inputProps={{
            onClick: (e) => console.log("CLICK", e),
          }}
        />
      </div>
    </div>
  );
}
