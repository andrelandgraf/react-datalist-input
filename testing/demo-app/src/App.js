import React, { useState } from 'react';

import './App.css';
import DataListInput from './DataListInput';

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

function App() {
    const [ item, setItem ] = useState();
    return (
        <div className="App">
            <div className="content">
                {
                    item && (
                        <div>
                            { `Current Item: ${ item.label }` }
                        </div>
                    )
                }
                <div className="wrapper">
                    <DataListInput
                        items={data}
                        onSelect={i => setItem( i )}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
