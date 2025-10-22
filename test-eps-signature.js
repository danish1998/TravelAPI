const crypto = require('crypto');

// Test EPS Signature Generator compatibility
const testEPSSignature = () => {
    console.log('🔐 Testing EPS Signature Generator Compatibility');
    console.log('==============================================');
    
    const apiKey = '9d2f7089-6827-4626-ba7c-f71687a21a3b';
    const sharedSecret = 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6';
    const timestamp = 1761067235; // From your example
    
    // Generate signature using our method
    const message = `${apiKey}${timestamp}`;
    const signature = crypto.createHmac('sha512', sharedSecret).update(message).digest('hex');
    
    // Expected signature from EPS Signature Generator
    const expectedSignature = '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc';
    
    console.log('API Key:', apiKey);
    console.log('Shared Secret:', sharedSecret.substring(0, 20) + '...');
    console.log('Timestamp:', timestamp);
    console.log('Message:', message);
    console.log('');
    console.log('Generated Signature:', signature);
    console.log('Expected Signature:', expectedSignature);
    console.log('');
    console.log('Signatures Match:', signature === expectedSignature ? '✅ YES' : '❌ NO');
    
    if (signature === expectedSignature) {
        console.log('🎉 Our signature generation matches EPS Signature Generator!');
    } else {
        console.log('❌ Signature mismatch - need to fix our implementation');
    }
    
    // Generate EPS Authentication header
    const authHeader = `EAN apikey=${apiKey},signature=${signature},timestamp=${timestamp}`;
    const expectedAuthHeader = `EAN apikey=${apiKey},signature=${expectedSignature},timestamp=${timestamp}`;
    
    console.log('');
    console.log('Generated Auth Header:', authHeader);
    console.log('Expected Auth Header:', expectedAuthHeader);
    console.log('Auth Headers Match:', authHeader === expectedAuthHeader ? '✅ YES' : '❌ NO');
};

// Test with current timestamp
const testCurrentTimestamp = () => {
    console.log('\n🕐 Testing with Current Timestamp');
    console.log('================================');
    
    const apiKey = '9d2f7089-6827-4626-ba7c-f71687a21a3b';
    const sharedSecret = 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6';
    const timestamp = Math.floor(Date.now() / 1000);
    
    const message = `${apiKey}${timestamp}`;
    const signature = crypto.createHmac('sha512', sharedSecret).update(message).digest('hex');
    const authHeader = `EAN apikey=${apiKey},signature=${signature},timestamp=${timestamp}`;
    
    console.log('Current Timestamp:', timestamp);
    console.log('Message:', message);
    console.log('Signature:', signature);
    console.log('Auth Header:', authHeader);
};

// Test signature generation function
const testSignatureFunction = () => {
    console.log('\n🔧 Testing Signature Generation Function');
    console.log('=====================================');
    
    const generateSignature = (apiKey, sharedSecret, timestamp) => {
        const message = `${apiKey}${timestamp}`;
        const signature = crypto.createHmac('sha512', sharedSecret).update(message).digest('hex');
        return signature;
    };
    
    const generateEPSAuthHeader = (apiKey, sharedSecret, timestamp) => {
        const signature = generateSignature(apiKey, sharedSecret, timestamp);
        return `EAN apikey=${apiKey},signature=${signature},timestamp=${timestamp}`;
    };
    
    const apiKey = '9d2f7089-6827-4626-ba7c-f71687a21a3b';
    const sharedSecret = 'ZTE3Y2IxNjYtMDI3Ni00YmMyLTg2YjgtM2IyYWIwNGQ2ZTE1OlJaMVItTGtENll4cGUwSHkxUGtNMlJVZy1iV25BX3B6';
    const timestamp = 1761067235;
    
    const signature = generateSignature(apiKey, sharedSecret, timestamp);
    const authHeader = generateEPSAuthHeader(apiKey, sharedSecret, timestamp);
    
    console.log('Function Generated Signature:', signature);
    console.log('Function Generated Auth Header:', authHeader);
    
    const expectedSignature = '03ca2d7cd0b2ba0fea82ec653142b8c2bfe68a73d0901c015fac0522b689e775a44f48865ac10fbc89357068449fb90a5b8a855f574f818562e58b639e7bffdc';
    const expectedAuthHeader = `EAN apikey=${apiKey},signature=${expectedSignature},timestamp=${timestamp}`;
    
    console.log('Expected Signature:', expectedSignature);
    console.log('Expected Auth Header:', expectedAuthHeader);
    console.log('Function Works Correctly:', signature === expectedSignature ? '✅ YES' : '❌ NO');
};

// Run all tests
const runTests = () => {
    testEPSSignature();
    testCurrentTimestamp();
    testSignatureFunction();
    
    console.log('\n✅ EPS Signature testing completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests();
}

module.exports = { testEPSSignature, testCurrentTimestamp, testSignatureFunction };



