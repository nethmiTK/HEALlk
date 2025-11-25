
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
      const token = localStorage.getItem('heallk_token');
      if (!token) {
        console.log('No token found in localStorage');
        setProducts([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      setProducts([]);
    }
    setLoading(false);
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
      if (!token) {
        toast.error('Please login first');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        const newProduct = { id: data.productId, ...formData };
        setProducts(prev => [...prev, newProduct]);
        toast.success('Product added!');
        resetForm();
      }
    } catch (error) {
      toast.error('Failed to add product');
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
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Product deleted!');
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
    <div className="bg-green-50 min-h-screen p-6 sm:p-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💊 Products Management</h1>
          <p className="text-gray-600">Manage your ayurvedic products and medicines</p>
        </div>
        <div>
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Products Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="text-3xl font-bold text-blue-600 mb-2">{products.length}</div>
          <div className="text-sm text-gray-600 font-medium">Total Products</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
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
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products added yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first ayurvedic product</p>
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={() => setIsModalOpen(true)}
          >
            Add First Product
          </button>
        </div>
      )}

      {/* Modal Background */}
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>}
      
      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{editingProduct ? '✏️ Edit Product' : '💊 Add New Product'}</h2>
                  <p className="text-purple-100 mt-1">Fill in the details below to {editingProduct ? 'update' : 'add'} your product</p>
                </div>
                <button 
                  onClick={resetForm} 
                  data-modal-close
                  className="text-white hover:text-red-200 text-2xl font-bold bg-white bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-8">

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
        </div>
      )}
    </div>
  );
};

export default Product;
