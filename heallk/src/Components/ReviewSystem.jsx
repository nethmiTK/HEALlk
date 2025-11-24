import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onRatingChange(star)}
          className={`text-2xl ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${!readOnly ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const ReviewSystem = ({ doctorId = 1 }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', patient_name: '', email: '' });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadReviews();
  }, [doctorId]);

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/public`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim() || !newReview.patient_name.trim() || !newReview.email.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          doctor_id: doctorId
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewReview({ rating: 0, comment: '', patient_name: '', email: '' });
        setShowForm(false);
        loadReviews();
        toast.success('Review submitted successfully!');
      } else {
        toast.error(data.message || 'Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = stats ? parseFloat(stats.average_rating).toFixed(1) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Reviews ({stats?.total_reviews || 0})</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add Review
        </button>
      </div>

      {reviews.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} readOnly />
            <span className="text-lg font-semibold">{averageRating}</span>
            <span className="text-gray-600">({stats?.total_reviews || 0} reviews)</span>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={submitReview} className="mb-6 p-4 border rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={newReview.patient_name}
              onChange={(e) => setNewReview({...newReview, patient_name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={newReview.email}
              onChange={(e) => setNewReview({...newReview, email: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating 
              rating={newReview.rating} 
              onRatingChange={(rating) => setNewReview({...newReview, rating})}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="w-full p-2 border rounded-lg h-24"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.review_id} className="border-b pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold">{review.patient_name || 'Anonymous'}</h4>
                <StarRating rating={review.rating} readOnly />
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>

          </div>
        ))}
      </div>

      {reviews.length === 0 && !showForm && (
        <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
      )}
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ReviewSystem;