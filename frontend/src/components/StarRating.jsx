import { useState } from "react";

export default function StarRating({ rating, setRating, readOnly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`text-2xl transition-transform duration-200 ${
            star <= (hover || rating) ? "text-amber-400" : "text-slate-300"
          } ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          onClick={() => !readOnly && setRating && setRating(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
