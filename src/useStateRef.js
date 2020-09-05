import { useState, useRef } from 'react';

const useStateRef = initalState => {
  const [state, setState] = useState(initalState);
  const ref = useRef(initalState);
  const setStateRef = newState => {
    setState(newState);
    ref.current = newState;
  };
  return [state, setStateRef, ref];
};

export default useStateRef;
