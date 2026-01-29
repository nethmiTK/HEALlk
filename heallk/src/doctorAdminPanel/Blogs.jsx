import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    summary: '',
    is_published: true
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('heallk_token');
      const url = editingBlog 
        ? `${API_BASE_URL}/blogs/${editingBlog.blog_id}`
        : `${API_BASE_URL}/blogs`;
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog added successfully!');
        setShowForm(false);
        setEditingBlog(null);
        setFormData({ title: '', content: '', image: '', summary: '', is_published: true });
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image || '',
      summary: blog.summary || '',
      is_published: blog.is_published === 1
    });
    setImagePreview(blog.image || '');
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData({ ...formData, image: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Blog deleted successfully!');
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const togglePublish = async (blogId) => {
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blog Articles</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBlog(null);
            setFormData({ title: '', content: '', image: '', summary: '', is_published: true });
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add New Blog'}
        </button>
      </div>

      {/* Search Bar */}
      {!showForm && (
        <div className="mb-6">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search blogs by title, content, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none text-gray-700 placeholder-gray-400 shadow-sm transition-all"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">
              🔍
            </div>
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingBlog ? 'Edit Blog' : 'Add New Blog'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Brief summary (optional)"
                rows="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-600 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Write your blog content here..."
                rows="10"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="is_published" className="ml-2 text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingBlog ? 'Update Blog' : 'Add Blog'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                  setFormData({ title: '', content: '', image: '', summary: '', is_published: true });
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6">
        {filteredBlogs.length === 0 && searchQuery ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-700 font-semibold mb-1">No Results Found</p>
            <p className="text-gray-500">Try different keywords or clear the search</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No blogs yet. Create your first blog article!</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog.blog_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                {blog.image ? (
                  <div className="md:w-1/3 bg-gray-100 flex items-center justify-center">
                    {blog.image.startsWith('data:') ? (
                      // Base64 image
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 md:h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-48 md:h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-sm">📷 Image unavailable</div>';
                        }}
                      />
                    ) : (
                      // URL image
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-48 md:h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-48 md:h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-600 text-sm">📷 Image unavailable</div>';
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="md:w-1/3 bg-gradient-to-br from-gray-200 to-gray-300 h-48 md:h-full flex items-center justify-center">
                    <span className="text-gray-500 text-3xl">📷</span>
                  </div>
                )}
                <div className={`p-6 ${blog.image ? 'md:w-2/3' : 'w-full'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>📅 {new Date(blog.created_at).toLocaleDateString()}</span>
                         <span>❤️ {blog.likes || 0} likes</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          blog.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {blog.is_published ? '✓ Published' : '✗ Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {blog.summary && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.summary}</p>
                  )}
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => togglePublish(blog.blog_id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      {blog.is_published ? '📝 Unpublish' : '✓ Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(blog.blog_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;
