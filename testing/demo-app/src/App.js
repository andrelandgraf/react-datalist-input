/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import csvFile from './data.csv';

import './App.css';
import DataListInput from './DataListInput';

// eslint-disable-next-line no-unused-vars
const data = [
  {
    key: '0',
    label: 'Apple',
  },
  {
    key: '1',
    label: 'Mango',
  },
  {
    key: '2',
    label: 'Potatoe',
  },
];

async function getAndParseData(filename) {
  const response = await fetch(filename);
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  const result = await reader.read();
  const allText = decoder.decode(result.value);

  const allTextLines = allText.split(/\r\n|\n/);
  const headers = allTextLines[0].split(',');
  const lines = [];

  for (let i = 1; i < allTextLines.length; i += 1) {
    const set = allTextLines[i].split(',');
    if (set.length === headers.length) {
      const tarr = {};
      for (let j = 0; j < headers.length; j += 1) {
        tarr[headers[j]] = set[j];
      }
      lines.push(tarr);
    }
  }
  return lines;
}

// eslint-disable-next-line no-unused-vars
function annoyinglySlowMatchingAlg(currentInput, item) {
  for (let i = 0; i < 100000; i += 1) {
    i += 1;
    i -= 1;
    // eslint-disable-next-line no-unused-expressions
    (currentInput.length + item.label.length) % 2;
  }
  return item.label.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase();
}

function App() {
  const [item, setItem] = useState();
  const [items, setItems] = useState(data);

  //   useEffect(() => {
  //     getAndParseData(csvFile).then(obj => setItems(obj
  //       .concat(obj)
  //       .map((row, i) => (
  //         {
  //           ...row,
  //           label: row.vorname,
  //           key: i,
  //         }
  //       ))));
  //   }, []);

  return (
    <div className="App">
      <div className="content">
        {
                    item && (
                    <div>
                      { `Current Item: ${item.label}` }
                    </div>
                    )
                }
        <div className="wrapper">
          <DataListInput
            items={items}
            onSelect={i => setItem(i)}
            placeholder="Select a ingredient"
            clearInputOnSelect
            suppressReselect={false}
            initialValue={item ? item.label : ''}
            // debounceTime={1000}
            // debounceLoader={<>Hello</>}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
