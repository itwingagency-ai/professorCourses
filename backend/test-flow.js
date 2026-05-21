const axios = require('axios');

async function testAuth() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'Password123!';
  const name = 'Test User';
  
  try {
    console.log(`[1] Registering user ${email}...`);
    const regRes = await axios.post('http://localhost:8000/api/v1/registration', { name, email, password });
    console.log(`Register response:`, regRes.data);
    
    // We need the OTP. Wait for 2 seconds to allow the backend to process the email and log the OTP.
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`[2] Registration initiated. Now check the backend logs for the OTP!`);
    console.log(`Activation token:`, regRes.data.activationToken);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAuth();
