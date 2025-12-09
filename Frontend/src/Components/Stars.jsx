import { useState, useEffect } from "react";
const Stars = () => {
  const [stars, setStars] = useState([]);
  const getStarCount = () => {
    return window.innerWidth < 300
      ? 25
      : window.innerWidth < 500
      ? 50
      : window.innerWidth < 800
      ? 70
      : 90;
  };
  const generateStar = (id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    scale: Math.random() * 0.4 + 0.4,
  });
  const adjustStars = () => {
    const needed = getStarCount();
    setStars((prev) => {
      const current = prev.length;
      if (current === needed) return prev;
      if (current > needed) {
        return prev.slice(0, needed);
      }
      const missing = needed - current;
      const newStars = [];
      for (let i = current; i < current + missing; i++) {
        newStars.push(generateStar(i));
      }
      return [...prev, ...newStars];
    });
  };

  useEffect(() => {
    adjustStars();
  }, []);

  useEffect(() => {
    let timeout;
    const handleresize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        adjustStars();
      }, 500);
    };
    window.addEventListener("resize", handleresize);
    return () => {
      clearTimeout(timeout);
      window.addEventListener("resize", handleresize);
    };
  }, []);
  return (
    <div className="starfield">
      {stars.length > 0 &&
        stars.map((star) => (
          <div
            key={star.id}
            className="star absolute "
            style={{
              left: `${star.x}vw`,
              top: `${star.y}vh`,
              animationDelay: `${star.delay}s`,
              transform: `scale(${star.scale})`,
            }}
          ></div>
        ))}
    </div>
  );
};

export default Stars;
