import { useMemo } from "react";
import { type Item, DatalistInput } from "../../app/combobox";

type CustomItem = Item & {
  description: string;
};

const items: Array<CustomItem> = [
  { id: "Chocolate", value: "Chocolate", description: "Chocolate is delicious" },
  { id: "Coconut", value: "Coconut", description: "Coconut is tasty but watch your head!" },
  { id: "Mint", value: "Mint", description: "Mint is a herb?" },
  { id: "Strawberry", value: "Strawberry", description: "Strawberries are red" },
  { id: "Vanilla", value: "Vanilla", description: "Vanilla is a flavor" },
];

function CustomItemNode({ item }: { item: CustomItem }) {
  return (
    <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
      <b>{item.value}</b>
      <span>{item.description}</span>
    </div>
  );
}

export function CustomOptionsPage() {
  const customItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        node: <CustomItemNode item={item} />,
      })),
    [],
  );

  return (
    <div className="demo-centered">
      <div style={{ width: "500px" }}>
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
