const axios = require('axios');

async function testActivateLogin() {
  const activation_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3R1c2VyXzE3NzkzNTg1NjYxMDFAZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6IlBhc3N3b3JkMTIzISJ9LCJhY3RpdmF0aW9uQ29kZSI6IjVlMGM1MDE4YmI5NDg3MTk2YzZlMWE2MzNiMGRmYjEyOWJiNjMxN2ZiMWRhMmVjNGM5M2M2YTNlNzRjNDIzYzgiLCJpYXQiOjE3NzkzNTg1NjYsImV4cCI6MTc3OTM1ODg2Nn0.9646PKeDUi5ZsCl612KPI76eq9kPJwHsxY4ge4YEwmA';
  const activation_code = '474303';
  const email = 'testuser_1779358566101@example.com';
  const password = 'Password123!';

  try {
    console.log(`[1] Activating user...`);
    const actRes = await axios.post('http://localhost:8000/api/v1/activate-user', { activation_token, activation_code });
    console.log(`Activate response:`, actRes.data);

    console.log(`[2] Logging in user...`);
    const loginRes = await axios.post('http://localhost:8000/api/v1/login', { email, password });
    console.log(`Login response status:`, loginRes.status, loginRes.data.success);
    console.log(`Logged in as:`, loginRes.data.user.email);
    console.log(`Success! The entire flow is fully operational locally.`);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testActivateLogin();
