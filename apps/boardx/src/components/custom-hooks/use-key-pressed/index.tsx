import { useState, useEffect } from "react";

const useKeyPress = () => {
  const [keyPressed, setKeyPressed] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyPressed(event.key);
    };

    const handleKeyUp = () => {
      setKeyPressed(null);
    };

    // Attach event listeners for keydown and keyup
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners when the component is unmounted
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keyPressed;
};

export default useKeyPress;
