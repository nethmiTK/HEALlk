
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    ingredient: '',
    wage: '',
    description: '',
    category: 'Medicine',
    is_active: true
  });

  const categories = ['Medicine', 'Supplement', 'Oil', 'Tea', 'Capsule', 'Powder', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('heallk_token');
      const url = editingProduct 
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products`;
      
      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingProduct ? 'Product updated!' : 'Product added!');
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      product_name: product.product_name,
      price: product.price,
      ingredient: product.ingredient || '',
      wage: product.wage || '',
      description: product.description || '',
      category: product.category || 'Medicine',
      is_active: product.is_active !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('heallk_token');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Product deleted!');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      price: '',
      ingredient: '',
      wage: '',
      description: '',
      category: 'Medicine',
      is_active: true
    });
    setEditingProduct(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">💊 Products Management</h1>
          <p className="page-subtitle">Manage your ayurvedic products and medicines</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Products Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-number">{products.length}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{products.filter(p => p.is_active !== false).length}</div>
          <div className="stat-label">Active Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{new Set(products.map(p => p.category)).size}</div>
          <div className="stat-label">Categories</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="services-grid">
        {products.map((product) => (
          <div key={product.id} className="service-card">
            <div className="service-header">
              <div>
                <h3 className="service-title">{product.product_name}</h3>
                <span className="service-category">{product.category}</span>
              </div>
              <div className="service-actions">
                <button
                  className="action-btn-small edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="action-btn-small delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {product.description && (
              <p className="service-description">{product.description}</p>
            )}

            <div className="service-details">
              <div className="detail-item">
                <span className="detail-label">Price</span>
                <span className="detail-value">Rs. {product.price}</span>
              </div>
              {product.wage && (
                <div className="detail-item">
                  <span className="detail-label">Wage</span>
                  <span className="detail-value">Rs. {product.wage}</span>
                </div>
              )}
            </div>

            {product.ingredient && (
              <div className="mt-3">
                <span className="detail-label">Ingredients:</span>
                <p className="text-sm text-gray-600 mt-1">{product.ingredient}</p>
              </div>
            )}

            <div className={`service-status ${product.is_active !== false ? 'status-active' : 'status-inactive'}`}>
              {product.is_active !== false ? 'Active' : 'Inactive'}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <h3>No products added yet</h3>
          <p>Start by adding your first ayurvedic product</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add First Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}} onClick={resetForm}>
          <div style={{background:'white',borderRadius:'12px',padding:'24px',width:'90%',maxWidth:'600px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 50px rgba(0,0,0,0.3)'}} onClick={(e) => e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px',paddingBottom:'16px',borderBottom:'1px solid #e2e8f0'}}>
              <h2 style={{fontSize:'20px',fontWeight:600,color:'#1a202c',margin:0}}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button style={{background:'none',border:'none',fontSize:'20px',cursor:'pointer',color:'#64748b',padding:'4px'}} onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label htmlFor="product_name" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Product Name</label>
                  <input
                    type="text"
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px'}}
                    required
                    placeholder="e.g., Ashwagandha Capsules"
                  />
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label htmlFor="category" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px'}}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label htmlFor="price" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Price (Rs.)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px'}}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  <label htmlFor="wage" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Wage (Rs.)</label>
                  <input
                    type="number"
                    id="wage"
                    name="wage"
                    value={formData.wage}
                    onChange={handleInputChange}
                    style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px'}}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <label htmlFor="ingredient" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Ingredients</label>
                <input
                  type="text"
                  id="ingredient"
                  name="ingredient"
                  value={formData.ingredient}
                  onChange={handleInputChange}
                  style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px'}}
                  placeholder="List main ingredients"
                />
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                <label htmlFor="description" style={{fontSize:'14px',fontWeight:600,color:'#374151'}}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{padding:'10px 12px',border:'2px solid #e5e7eb',borderRadius:'8px',fontSize:'14px',resize:'vertical',minHeight:'80px'}}
                  rows="3"
                  placeholder="Describe the product benefits and usage..."
                ></textarea>
              </div>

              <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'8px'}}>
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  style={{width:'16px',height:'16px'}}
                />
                <label htmlFor="is_active" style={{fontSize:'14px',color:'#374151',cursor:'pointer'}}>Product is active and available</label>
              </div>

              <div style={{display:'flex',justifyContent:'flex-end',gap:'12px',marginTop:'20px',paddingTop:'16px',borderTop:'1px solid #e5e7eb'}}>
                <button type="submit" style={{padding:'12px 24px',fontSize:'16px',fontWeight:600,background:'linear-gradient(135deg, #1a237e 0%, #283593 100%)',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
