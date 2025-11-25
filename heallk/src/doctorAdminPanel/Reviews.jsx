import React, { useState, useEffect } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average_rating: 0,
    total_reviews: 0,
    rating_distribution: {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    },
    pending_reviews: 0,
    approved_reviews: 0,
    rejected_reviews: 0
  });
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [sortBy, setSortBy] = useState('created_at'); // created_at, rating
  const [order, setOrder] = useState('DESC');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_reviews: 0,
    per_page: 10
  });

  useEffect(() => {
    loadReviews();
    loadStatistics();
  }, [pagination.current_page, sortBy, order]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        sort: sortBy,
        order: order
      };
      
      const token = localStorage.getItem('heallk_token');
      const queryString = new URLSearchParams(params).toString();

      const response = await fetch(`http://localhost:5000/api/reviews?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setReviews(data.reviews || []);
        setPagination(data.pagination || pagination);
      } else {
        throw new Error(data.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      setError(error.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch('http://localhost:5000/api/reviews/statistics', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStats(data.statistics || stats);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const getFilteredReviews = () => {
    let filtered = reviews;

    if (filter === 'pending') {
      filtered = reviews.filter(review => review.status === 'pending');
    } else if (filter === 'approved') {
      filtered = reviews.filter(review => review.status === 'approved');
    } else if (filter === 'rejected') {
      filtered = reviews.filter(review => review.status === 'rejected');
    }

    return filtered;
  };

  const handleApproveReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setReviews(prev => prev.map(review =>
          review.review_id === reviewId ? { ...review, status: 'approved' } : review
        ));
        loadStatistics(); // Refresh stats
      } else {
        throw new Error(data.message || 'Failed to approve review');
      }
    } catch (error) {
      console.error('Error approving review:', error);
      setError('Failed to approve review');
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('heallk_token');
      
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setReviews(prev => prev.map(review =>
          review.review_id === reviewId ? { ...review, status: 'rejected' } : review
        ));
        loadStatistics(); // Refresh stats
      } else {
        throw new Error(data.message || 'Failed to reject review');
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      setError('Failed to reject review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('heallk_token');
        
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          setReviews(prev => prev.filter(review => review.review_id !== reviewId));
          loadStatistics(); // Refresh stats
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review');
      }
    }
  };

  const handleSortChange = (newSort) => {
    if (newSort === sortBy) {
      setOrder(order === 'DESC' ? 'ASC' : 'DESC');
    } else {
      setSortBy(newSort);
      setOrder('DESC');
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="p-6 bg-green-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-6xl animate-pulse">⏳</div>
          <p className="ml-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-green-50 min-h-screen">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Reviews</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" onClick={() => loadReviews()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 min-h-screen p-6 sm:p-4">
      {/* Page Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reviews & Feedback</h1>
          <p className="text-gray-600">Manage patient reviews and build your reputation</p>
        </div>
      </div>

      {/* Reviews Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-yellow-500 mb-2">{Number(stats.average_rating).toFixed(1)}</div>
            <div className="text-2xl text-yellow-400 mb-2">{getRatingStars(Math.round(stats.average_rating))}</div>
            <div className="text-gray-600">{stats.total_reviews} reviews</div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{rating} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${stats.total_reviews > 0 ? (stats.rating_distribution[rating] / stats.total_reviews) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{stats.rating_distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <span className="text-3xl font-bold text-orange-500 block mb-2">{stats.pending_reviews}</span>
              <span className="text-sm text-gray-600 font-medium">Pending Approval</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-green-500 block mb-2">{stats.approved_reviews}</span>
              <span className="text-sm text-gray-600 font-medium">Approved</span>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-500 block mb-2">{stats.rating_distribution[4] + stats.rating_distribution[5]}</span>
              <span className="text-sm text-gray-600 font-medium">Positive Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'all' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('all')}
            >
              All Reviews ({stats.total_reviews})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'pending' 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending_reviews})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'approved' 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('approved')}
            >
              Approved ({stats.approved_reviews})
            </button>
            <button 
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === 'rejected' 
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({stats.rejected_reviews})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              id="sortBy" 
              value={`${sortBy}_${order}`} 
              onChange={(e) => {
                const [sort, orderVal] = e.target.value.split('_');
                setSortBy(sort);
                setOrder(orderVal);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option value="created_at_DESC">Newest First</option>
              <option value="created_at_ASC">Oldest First</option>
              <option value="rating_DESC">Highest Rating</option>
              <option value="rating_ASC">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.review_id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.review_id.toString().slice(-1)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Patient #{review.review_id}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-600">({review.rating}/5)</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                review.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                review.status === 'approved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {review.status === 'pending' && '⏳ Pending'}
                {review.status === 'approved' && '✅ Approved'}
                {review.status === 'rejected' && '❌ Rejected'}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
              {review.status === 'pending' && (
                <>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                    onClick={() => handleApproveReview(review.review_id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2"
                    onClick={() => handleRejectReview(review.review_id)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                </>
              )}
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-2"
                onClick={() => handleDeleteReview(review.review_id)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
              {review.rating <= 3 && (
                <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-medium text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Flag for Follow-up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No reviews found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'You haven\'t received any reviews yet. Provide excellent care to get your first review!'
              : `No reviews match the "${filter}" filter.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;