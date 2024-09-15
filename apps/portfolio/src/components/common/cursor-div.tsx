import React, { useState, useEffect } from "react";

const CursorTracker = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="z-[1000] mix-blend-difference"
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: "10px",
        height: "10px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)", // Center the div around the cursor
        transition:
          "transform 0.3s ease, opacity 0.4s ease, -webkit-transform 0.3s ease",
        pointerEvents: "none", // Allows cursor to pass through the div
      }}
    />
  );
};

export default CursorTracker;
