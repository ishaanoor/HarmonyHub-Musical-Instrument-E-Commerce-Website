const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

let adminToken;
let customerToken;

beforeAll(() => {
  process.env.JWT_SECRET = 'my_ultra_secure_musical_hub_secret_key_2026';
  adminToken = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
  customerToken = jwt.sign({ id: 2, role: 'customer' }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await pool.end();
});

describe('HarmonyHub Catalog Sprint 2 Test Engine', () => {
  
  test('Should block product creation with 401 if token is missing', async () => {
    const res = await request(app)
      .post('/api/v1/admin/products')
      .send({ name: 'No Token Pipe', slug: 'no-token', category_id: 1 });
    expect(res.statusCode).toBe(401);
  });

  test('Should block non-admin users with 403 Forbidden status', async () => {
    const res = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Customer Attempt', slug: 'customer-slug', category_id: 1 });
    expect(res.statusCode).toBe(403);
  });

  test('Should successfully register product when valid admin token hits route', async () => {
    const freshSlug = `test-guitar-${Date.now()}`;
    
    
    const categoryCheck = await pool.query('SELECT id FROM categories LIMIT 1');
    const validCategoryId = categoryCheck.rows.length > 0 ? categoryCheck.rows[0].id : 1;

    const res = await request(app)
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category_id: validCategoryId,
        name: 'Test Fender Guitar Item',
        slug: freshSlug,
        description: 'Automated test suite entry item.',
        status: 'draft'
      });
      
    expect(res.statusCode).toBe(201);
    
    
    const responseData = Array.isArray(res.body) ? res.body[0] : res.body;
    expect(responseData).toHaveProperty('slug', freshSlug);
  });
});


