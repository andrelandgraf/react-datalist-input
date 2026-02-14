import { useCallback, useEffect, useState } from "react";
import {
  DatalistInput,
  useComboboxControls,
  type Item,
  type Filter,
  startsWithValueFilter,
} from "../../app/combobox";

const items = [
  { id: "Chocolate", value: "Chocolate" },
  { id: "Coconut", value: "Coconut" },
  { id: "Mint", value: "Mint" },
  { id: "Strawberry", value: "Strawberry" },
  { id: "Vanilla", value: "Vanilla" },
];

export function MultiSelectPage() {
  const { isExpanded, setIsExpanded, setValue, value } = useComboboxControls({ isExpanded: true });
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    if (selectedItems.length === 3) {
      setIsExpanded(false);
    }
  }, [selectedItems, setIsExpanded]);

  const customFilter: Filter = useCallback(
    (options) => options.filter((o) => !selectedItems.find((s) => s.id === o.id)),
    [selectedItems],
  );

  return (
    <div style={{ lineHeight: "1.4", display: "flex", flexDirection: "column", gap: 12 }}>
      <h2>Selected:</h2>
      <ul>
        {selectedItems.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
      <div style={{ width: "500px" }}>
        <DatalistInput
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          value={value}
          setValue={setValue}
          onSelect={(item) => {
            if (selectedItems.length >= 3) setSelectedItems([item]);
            else setSelectedItems((prevItems) => [...prevItems, item]);
            setValue("");
            setIsExpanded(true);
          }}
          label="Select ice cream flavor"
          showLabel={false}
          items={items}
          filters={[customFilter, startsWithValueFilter]}
        />
      </div>
    </div>
  );
}
