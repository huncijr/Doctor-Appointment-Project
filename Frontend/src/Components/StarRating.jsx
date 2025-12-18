import { useState } from "react";
const StarRating = ({ maxStars = 5, onChange }) => {
  const [rating, setRating] = useState(0);
  const handleClick = (star) => {
    setRating(star);
    if (onChange) onChange(star);
  };
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          className={`cursor-pointer text-5xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
