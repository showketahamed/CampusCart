import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data));
    
    // Fetch reviews for the product
    api.get(`/products/${id}/reviews`)
       .then((r) => setReviews(r.data.reviews || r.data || []))
       .catch((e) => console.log("Failed to fetch reviews", e));
  }, [id]);

  const handleReviewSubmitted = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  if (!product) return <div><Navbar /><div className="p-10">Loading...</div></div>;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 space-y-8 px-4">
        
        {/* Product Details Card */}
        <div className="card p-6 md:p-10 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">{product.name}</h1>
            <p className="text-slate-500 font-medium mt-1">Sold by: {product.vendorId?.name || "Unknown Vendor"}</p>
            
            <div className="flex items-center gap-2 mt-4 bg-slate-50 w-max px-3 py-1.5 rounded-lg border border-slate-100">
              <StarRating rating={Math.round(averageRating)} readOnly />
              <span className="text-sm font-bold text-slate-700">{averageRating}</span>
              <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
            </div>

            <p className="mt-6 text-slate-600 leading-relaxed text-lg">{product.description}</p>
            <p className="mt-6 text-3xl font-black bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              {"\u09F3"}{product.price}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          {user ? (
            <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
          ) : (
            <div className="card p-6 mt-6 bg-slate-50/50 text-center">
              <p className="text-slate-600">Please <a href="/login" className="text-brand-600 font-bold hover:underline">log in</a> to write a review.</p>
            </div>
          )}
          
          <ReviewList reviews={reviews} />
        </div>
        
      </div>
    </div>
  );
}
