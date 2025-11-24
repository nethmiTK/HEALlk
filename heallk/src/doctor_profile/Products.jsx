import React from 'react';

const Products = ({ doctor }) => {
  const products = [
    {
      id: 1,
      name: 'Herbal Tea Blend',
      price: 'Rs. 1,500',
      image: '🍵',
      description: 'Natural herbal tea for digestive health'
    },
    {
      id: 2,
      name: 'Ayurvedic Oil',
      price: 'Rs. 2,500',
      image: '🫗',
      description: 'Traditional massage oil for joint pain relief'
    },
    {
      id: 3,
      name: 'Immunity Booster',
      price: 'Rs. 3,000',
      image: '💊',
      description: 'Natural supplements to boost immunity'
    },
    {
      id: 4,
      name: 'Stress Relief Capsules',
      price: 'Rs. 2,000',
      image: '🌿',
      description: 'Herbal capsules for stress and anxiety relief'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Ayurvedic Products</h1>
          <p className="text-gray-600">Natural remedies and herbal products recommended by Dr. {doctor?.name || 'John Doe'}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">{product.image}</div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="text-2xl font-bold text-green-600 mb-4">{product.price}</div>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Product Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg hover:bg-green-50">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="font-medium">Herbal Medicines</h3>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-green-50">
              <div className="text-3xl mb-2">🫗</div>
              <h3 className="font-medium">Oils & Balms</h3>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-green-50">
              <div className="text-3xl mb-2">🍵</div>
              <h3 className="font-medium">Teas & Tonics</h3>
            </div>
            <div className="text-center p-4 border rounded-lg hover:bg-green-50">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="font-medium">Supplements</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;