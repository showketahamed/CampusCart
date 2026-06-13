import { useState } from "react";
import StarRating from "./StarRating";
import api from "../api/client";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const { data } = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      });
      setRating(0);
      setComment("");
      if (onReviewSubmitted) onReviewSubmitted(data.review || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Rating</label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2">Comment</label>
        <textarea
          className="input min-h-[100px] resize-y"
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
