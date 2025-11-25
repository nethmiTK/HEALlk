const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  console.log('GET /api/products called');
  res.status(200).json({ success: true, products: [] });
});

app.post('/api/products', (req, res) => {
  console.log('POST /api/products called');
  res.status(200).json({ success: true, message: 'Product added successfully', productId: 1 });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});