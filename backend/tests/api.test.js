const request = require('supertest');
const app = require('../src/server');

describe('Classify API - Health Check Tests', () => {
  
  test('GET /api/health should return 200 status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
  });

  test('GET /api/health should return correct response structure', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('version');
  });

  test('GET /api/health should return status OK', async () => {
    const response = await request(app).get('/api/health');
    expect(response.body.status).toBe('OK');
  });

  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Classify');
  });

  test('GET /invalid-route should return 404', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

});

describe('Classify API - Course Endpoints', () => {
  
  test('GET /api/courses should return success', async () => {
    const response = await request(app).get('/api/courses');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

});

describe('Classify API - Review Endpoints', () => {
  
  test('GET /api/reviews should return success', async () => {
    const response = await request(app).get('/api/reviews');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

});
