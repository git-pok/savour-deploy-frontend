import { useEffect, useState } from 'react';

const useLocalStorage = ( key, value ) => {

    const [ state, setState ] = useState(() => (
      JSON.parse(localStorage.getItem(key)) || value
    ));
  
    useEffect(() => {
      window.localStorage.setItem(key, JSON.stringify(state));
    }, [key, state])
  
    return [state, setState];
}
  
export default useLocalStorage;