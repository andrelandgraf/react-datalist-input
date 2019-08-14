import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';

import DataListInput from './DataListInput';

const data = [
  {
    key: 0,
    label: 'Apple',
  },
  {
    key: 1,
    label: 'Mango',
  },
  {
    key: 2,
    label: 'Potatoe',
  },
]

function App() {
  const [ item, setItem ] = useState();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
        {
          item && (
          <div>
            Current Item: { item.label }
          </div>
          )
        }

        <DataListInput
          items={data}
          onSelect={ ( i ) => setItem( i )}
        />
      </div>
      </header>
    </div>
  );
}

export default App;
