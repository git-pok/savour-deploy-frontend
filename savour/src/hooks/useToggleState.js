import { useState } from 'react';

const useToggleState = (value) => {

  const [ state, setState ] = useState(value);

  const toggleState = () => (
    setState(state => !state)
  )

  return [state, toggleState];
}

export default useToggleState;