import StarRating from "./StarRating";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 text-center py-10 card bg-slate-50/50">
        <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={review._id || index} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-brand-600">
                {review.userId?.name || review.authorName || "Anonymous"}
              </span>
              <span className="text-xs text-slate-400">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
            <div className="mb-3">
              <StarRating rating={review.rating} readOnly />
            </div>
            <p className="text-slate-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
