import { DatalistInput } from "../../app/combobox";

const items = new Array(1000).fill(0).map((_, index) => ({
  id: `${index}`,
  value: `value ${index}`,
}));

export function LargePage() {
  return (
    <div className="demo-centered">
      <div style={{ width: "500px" }}>
        <DatalistInput
          label="Select your favorite flavor"
          placeholder="Chocolate"
          items={items}
          onSelect={(i) => console.log(i)}
          listboxProps={{
            style: { maxHeight: "300px", overflowY: "scroll" },
          }}
        />
      </div>
    </div>
  );
}
