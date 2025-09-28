// Test file for Vercel deployment verification
const request = require('supertest');
const app = require('../server');

describe('Vercel Deployment Tests', () => {
  test('should respond to health check endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('should serve the main page', async () => {
    const response = await request(app).get('/');
    // Expect either a successful response or a redirect
    expect([200, 302]).toContain(response.status);
  });
});