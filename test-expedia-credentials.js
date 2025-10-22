const axios = require('axios');
const crypto = require('crypto');

// Test Expedia credentials directly
const testExpediaCredentials = async () => {
    console.log('🔑 Testing Expedia API Credentials');
    console.log('==================================\n');
    
    const apiKey = '9d2f7089-6827-4626-ba7c-f71687a21a3b';
    const sharedSecret = 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6';
    
    // Generate signature
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureString = `${apiKey}${sharedSecret}${timestamp}`;
    const signature = crypto.createHash('sha512').update(signatureString).digest('hex');
    
    console.log('API Key:', apiKey);
    console.log('Timestamp:', timestamp);
    console.log('Signature:', signature.substring(0, 20) + '...');
    console.log('Signature Length:', signature.length);
    
    // Test 1: Basic API call with minimal parameters
    console.log('\n🧪 Test 1: Basic API call');
    try {
        const response = await axios.get('https://apim.expedia.com/hotels/listings', {
            headers: {
                'Accept': 'application/vnd.exp-hotel.v3+json',
                'Accept-Encoding': 'gzip',
                'Key': apiKey,
                'Authorization': signature,
                'Partner-Transaction-Id': `test_${timestamp}`
            },
            params: {
                locationKeyword: 'seattle',
                checkIn: '2025-01-15',
                checkOut: '2025-01-17',
                'room1[adults]': 2
            },
            timeout: 10000
        });
        
        console.log('✅ SUCCESS! API call worked');
        console.log('Status:', response.status);
        console.log('Response keys:', Object.keys(response.data));
        console.log('Hotel count:', response.data.Count || 'N/A');
        
    } catch (error) {
        console.log('❌ FAILED:', error.response?.status || error.message);
        if (error.response?.data) {
            console.log('Error details:', error.response.data);
        }
    }
    
    // Test 2: Try with different authentication method
    console.log('\n🧪 Test 2: Alternative authentication');
    try {
        const response = await axios.get('https://apim.expedia.com/hotels/listings', {
            headers: {
                'Accept': 'application/vnd.exp-hotel.v3+json',
                'Accept-Encoding': 'gzip',
                'apikey': apiKey,
                'signature': signature,
                'timestamp': timestamp.toString(),
                'Partner-Transaction-Id': `test2_${timestamp}`
            },
            params: {
                locationKeyword: 'seattle',
                checkIn: '2025-01-15',
                checkOut: '2025-01-17',
                'room1[adults]': 2
            },
            timeout: 10000
        });
        
        console.log('✅ SUCCESS! Alternative auth worked');
        console.log('Status:', response.status);
        
    } catch (error) {
        console.log('❌ FAILED:', error.response?.status || error.message);
        if (error.response?.data) {
            console.log('Error details:', error.response.data);
        }
    }
    
    // Test 3: Check if credentials are valid by trying a different endpoint
    console.log('\n🧪 Test 3: Check API access');
    try {
        const response = await axios.get('https://apim.expedia.com', {
            headers: {
                'Accept': 'application/json',
                'Key': apiKey,
                'Authorization': signature
            },
            timeout: 5000
        });
        
        console.log('✅ API accessible');
        console.log('Status:', response.status);
        
    } catch (error) {
        console.log('❌ API not accessible:', error.response?.status || error.message);
    }
    
    console.log('\n📋 Summary:');
    console.log('- API Key:', apiKey);
    console.log('- Shared Secret:', sharedSecret.substring(0, 20) + '...');
    console.log('- Endpoint: https://apim.expedia.com/hotels/listings');
    console.log('- Authentication: SHA-512 signature with timestamp');
    console.log('- Headers: Key, Authorization, Partner-Transaction-Id');
};

// Run the test
if (require.main === module) {
    testExpediaCredentials().catch(console.error);
}

module.exports = { testExpediaCredentials };
