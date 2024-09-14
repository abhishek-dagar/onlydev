import { useState, useEffect } from 'react';

const useKeyPress = () => {
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const handleSetKeyPressed = (value: Set<string>) => {
    setKeysPressed(value);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(event.key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeysPressed(prev => {
        const updatedKeys = new Set(prev);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    // Attach event listeners for keydown and keyup
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up the event listeners when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return [Array.from(keysPressed),handleSetKeyPressed];
};

export default useKeyPress;
