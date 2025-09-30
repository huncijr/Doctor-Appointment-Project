import { useState, useEffect } from "react";

import React from "react";

const Meteors = () => {
  const [meteors, setMeteor] = useState([]);
  useEffect(() => {
    setMeteor([
      { x: Math.random() * 100, y: 0, dx: 200, dy: 200 },
      { x: Math.random() * 100, y: 0, dx: 200, dy: 200 },
      { x: Math.random() * 100, y: 0, dx: 200, dy: 200 },
    ]);

    const interval = setInterval(() => {
      setMeteor((prev) => {
        const angle = Math.random() * 45 + 20;
        const distance = 500;
        const rad = (angle * Math.PI) / 180;

        const newMeteors = [
          ...prev,
          {
            x: Math.random() * 100,
            y: 0,
            dx: Math.cos(rad) * distance,
            dy: Math.sin(rad) * distance,
          },
          {
            x: Math.random() * 100,
            y: 0,
            dx: Math.cos(rad) * distance,
            dy: Math.sin(rad) * distance,
          },
          {
            x: Math.random() * 100,
            y: 0,
            dx: Math.cos(rad) * distance,
            dy: Math.sin(rad) * distance,
          },
        ];

        return newMeteors.length > 12 ? newMeteors.slice(2) : newMeteors;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full bg-black ">
      {meteors.map((meteor, i) => (
        <div
          className="absolute w-2 h-14 bg-white rounded-full animate-meteor"
          key={i}
          style={{
            left: `${meteor.x}%`,
            top: `${meteor.y}px`,
          }}
        >
          {console.log(meteor.x)}
        </div>
      ))}
    </div>
  );
};

export default Meteors;
