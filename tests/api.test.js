const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  it('should return welcome message for root endpoint', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(res.body.message).toBe('Fileaty API is running!');
  });
  
  // Add more tests here as needed
});