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
      <div className="reviews-controls">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews ({stats.total_reviews})
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending_reviews})
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved ({stats.approved_reviews})
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({stats.rejected_reviews})
          </button>
        </div>

        <div className="sort-controls">
          <label htmlFor="sortBy">Sort by:</label>
          <select 
            id="sortBy" 
            value={`${sortBy}_${order}`} 
            onChange={(e) => {
              const [sort, orderVal] = e.target.value.split('_');
              setSortBy(sort);
              setOrder(orderVal);
            }}
          >
            <option value="created_at_DESC">Newest First</option>
            <option value="created_at_ASC">Oldest First</option>
            <option value="rating_DESC">Highest Rating</option>
            <option value="rating_ASC">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.map((review) => (
          <div key={review.review_id} className={`review-card ${review.status}`}>
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">👤</div>
                <div className="reviewer-details">
                  <h4 className="reviewer-name">Patient #{review.review_id}</h4>
                  <div className="review-meta">
                    <span className="review-rating">{getRatingStars(review.rating)}</span>
                    <span className="review-date">{formatDate(review.created_at)}</span>
                  </div>
                </div>
              </div>

              <div className="review-status-badge">
                <span className={`status-badge ${review.status}`}>
                  {review.status === 'pending' && '⏳ Pending'}
                  {review.status === 'approved' && '✅ Approved'}
                  {review.status === 'rejected' && '❌ Rejected'}
                </span>
              </div>
            </div>

            <div className="review-content">
              <p className="review-comment">{review.comment}</p>
            </div>

            {/* Note: Doctor reply functionality can be added later if needed */}

            {/* Review Actions */}
            <div className="review-actions">
              {review.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApproveReview(review.review_id)}
                  >
                    ✅ Approve
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRejectReview(review.review_id)}
                  >
                    ❌ Reject
                  </button>
                </>
              )}
              <button 
                className="btn btn-danger btn-text"
                onClick={() => handleDeleteReview(review.review_id)}
              >
                🗑️ Delete
              </button>
              {review.rating <= 3 && (
                <button className="btn btn-text warning">
                  ⚠️ Flag for Follow-up
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No reviews found</h3>
          <p>
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