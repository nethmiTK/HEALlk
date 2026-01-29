import React from 'react';
import { motion } from 'framer-motion';

const OrderConfirmationModal = ({ product, userPhone, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <motion.div 
        className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-md my-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white">📱 Order Confirmation</h2>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Product Details */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <span>📦</span> Product Details
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 font-medium">Product Name:</span>
                <span className="font-medium text-gray-800 text-right max-w-[150px] sm:max-w-[200px] break-words">{product.product_name}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 font-medium">Category:</span>
                <span className="font-medium text-gray-800">{product.category}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-600 font-medium">Price:</span>
                <span className="font-bold text-green-600">Rs. {parseFloat(product.price).toFixed(2)}</span>
              </div>
            </div>
          </div>

          

          {/* Additional Info */}
          {product.ingredient && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">🌿 Ingredients:</h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">{product.ingredient}</p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">📝 Description:</h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">{product.description}</p>
            </div>
          )}

          {/* Vendor Name */}
          {product.doctor_name && (
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm">👨‍⚕️Doctor:</h3>
              <p className="text-sm sm:text-base text-blue-700 font-medium">{product.doctor_name}</p>
            </div>
          )}

          {/* Info Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-amber-800">
              <span className="font-semibold">Note:</span> Clicking the button below will open WhatsApp with the vendor's contact and product details.
            </p>
          </div>
        </div>

        {/* Modal Footer - Sticky */}
        <div className="bg-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 justify-end rounded-b-lg sticky bottom-0 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="px-4 sm:px-6 py-2 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="px-4 sm:px-6 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 font-medium transition-colors flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.707 12.707a1 1 0 0 0-1.414-1.414L11 17.586l-3.293-3.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l6-6z" />
            </svg>
            <span className="hidden sm:inline">Chat on</span> WhatsApp
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmationModal;
