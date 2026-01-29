import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const BlogSection = ({ doctorId }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    if (doctorId) {
      // Check if doctorId is a number or a name
      if (isNaN(doctorId)) {
        // It's a doctor name, fetch doctor by name first
        fetchDoctorByName(doctorId);
      } else {
        // It's a numeric ID
        fetchBlogs(doctorId);
        fetchDoctorNameById(doctorId);
      }
    }
  }, [doctorId]);

  useEffect(() => {
    // Filter blogs based on search query
    if (searchQuery.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.summary?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, blogs]);

  const fetchDoctorByName = async (doctorName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/doctors/by-name/${encodeURIComponent(doctorName)}`);
      const data = await response.json();
      if (data.success && data.doctor) {
        const actualDoctorId = data.doctor.user_id;
        setDoctorName(data.doctor.full_name || doctorName);
        // Fetch blogs with the actual ID
        fetchBlogs(actualDoctorId);
      } else {
        console.error('Doctor not found:', doctorName);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching doctor by name:', error);
      setLoading(false);
    }
  };;

  const fetchBlogs = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/blogs/doctor/${id}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
        // Check like status for each blog
        data.blogs.forEach(blog => checkLikeStatus(blog.blog_id));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorNameById = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/doctors/${id}`);
      const data = await response.json();
      if (data.success && data.doctor) {
        setDoctorName(data.doctor.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching doctor name:', error);
    }
  };

  const checkLikeStatus = async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/blogs/${blogId}/like-status`);
      const data = await response.json();
      if (data.success) {
        setLikedBlogs(prev => ({ ...prev, [blogId]: data.liked }));
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const toggleLike = async (blogId, e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_BASE_URL}/public/blogs/${blogId}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setLikedBlogs(prev => ({ ...prev, [blogId]: data.liked }));
        // Update likes count in blogs array
        setBlogs(prev => prev.map(blog => 
          blog.blog_id === blogId 
            ? { ...blog, likes: blog.likes + (data.liked ? 1 : -1) }
            : blog
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const BlogCard = ({ blog, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      {blog.image ? (
        <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.parentElement) {
                e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600"><span class="text-3xl">📷</span></div>';
              }
            }}
          />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            {formatDate(blog.created_at)}
          </div>
        </div>
      ) : (
        <div className="h-40 sm:h-48 md:h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-5xl">📷</span>
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          {blog.title}
        </h3>
        
        {blog.summary ? (
          <p className="text-gray-600 mb-4 line-clamp-3">{blog.summary}</p>
        ) : (
          <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button
            onClick={(e) => toggleLike(blog.blog_id, e)}
            className={`flex items-center gap-1 transition-all ${
              likedBlogs[blog.blog_id] 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <span className="text-lg">{likedBlogs[blog.blog_id] ? '❤️' : '🤍'}</span>
            <span>{blog.likes || 0}</span>
          </button>
          <button className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1">
            Read More →
          </button>
        </div>
      </div>
    </motion.div>
  );

  const BlogModal = ({ blog, onClose }) => {
    const handleDownload = () => {
      const element = document.createElement('a');
      const file = new Blob([`${blog.title}\n\n${blog.content}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${blog.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-2xl sm:max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with image */}
          {blog.image ? (
            <div className="relative h-48 sm:h-72 overflow-hidden bg-gray-100">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.parentElement) {
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600"><span class="text-5xl">📷</span></div>';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <button
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white hover:bg-gray-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg transition-colors text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="h-16 sm:h-20 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between px-4 sm:px-8 border-b border-gray-100">
              <button
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-colors text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              {blog.title}
            </h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">📅 {formatDate(blog.created_at)}</span>
                <span className="flex items-center gap-1">👁️ {blog.views || 0} views</span>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={(e) => toggleLike(blog.blog_id, e)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all text-sm font-semibold ${
                    likedBlogs[blog.blog_id] 
                      ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{likedBlogs[blog.blog_id] ? '❤️' : '🤍'}</span>
                  <span className="hidden sm:inline">{blog.likes || 0}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-all text-sm font-semibold"
                  title="Download article as text file"
                >
                  <span>⬇️</span>
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Summary */}
            {blog.summary && (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm sm:text-base text-green-900 italic font-medium">{blog.summary}</p>
              </div>
            )}
            
            {/* Main content */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed sm:leading-8 whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-500 italic">
                Last updated: {formatDate(blog.updated_at || blog.created_at)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Blog Posts Yet</h3>
        <p className="text-gray-500">Check back later for insightful medical articles!</p>
      </motion.div>
    );
  }

  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Blog Articles
        </h2>
        <p className="text-gray-600">
          {doctorName ? `Insights and knowledge from Dr. ${doctorName}` : 'Insights and knowledge from our medical expert'}
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search blogs by title, content, or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-700 placeholder-gray-400 shadow-sm transition-all"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
            🔍
          </div>
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
          </p>
        )}
      </motion.div>

      {filteredBlogs.length === 0 && searchQuery ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Results Found</h3>
          <p className="text-gray-500">Try different keywords or clear the search</p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.blog_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogCard blog={blog} onClick={() => setSelectedBlog(blog)} />
            </motion.div>
          ))}
        </div>
      )}

      {selectedBlog && <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />}
    </div>
  );
};

export default BlogSection;
