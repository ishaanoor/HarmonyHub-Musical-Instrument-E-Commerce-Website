const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyAdmin = require('../middleware/authenticate');

// CAT-02: Create new Product entry
router.post('/products', verifyAdmin, async (req, res) => {
  const { category_id, name, slug, description, status } = req.body;

  if (!name || !slug || !category_id) {
    return res.status(400).json({ error: 'Missing payload elements: name, slug, or category_id.' });
  }

  try {
    const query = `
      INSERT INTO products (category_id, name, slug, description, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await pool.query(query, [category_id, name, slug, description, status || 'draft']);
    
    // Return array wrapped rows matching the student database layout specification
    return res.status(201).json(result.rows);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: `Data conflict: The product slug '${slug}' already exists.` });
    }
    return res.status(500).json({ error: 'Internal system fault logging catalog entry.' });
  }
});

// CAT-03: Add unique SKU mapping to an item variant
router.post('/products/:id/skus', verifyAdmin, async (req, res) => {
  const { variant_id, sku_code, price, stock_quantity } = req.body;

  if (!variant_id || !sku_code || price === undefined || stock_quantity === undefined) {
    return res.status(400).json({ error: 'Missing properties. Check inputs.' });
  }

  if (Number(price) < 0 || Number(stock_quantity) < 0) {
    return res.status(400).json({ error: 'Financial values and stock totals cannot drop below zero bounds.' });
  }

  try {
    const query = `
      INSERT INTO skus (variant_id, sku_code, price, stock_quantity)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const result = await pool.query(query, [variant_id, sku_code, price, stock_quantity]);
    return res.status(201).json(result.rows);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: `Inventory conflict: SKU string code '${sku_code}' is registered elsewhere.` });
    }
    return res.status(500).json({ error: 'Internal database operation exception.' });
  }
});

module.exports = router;

