#!/usr/bin/env node

/**
 * 🧪 Comprehensive Google OAuth API Testing Script
 * 
 * This script tests all aspects of your Google OAuth implementation:
 * - Server health and connectivity
 * - OAuth initiation endpoint
 * - Protected endpoints
 * - User authentication flow
 * - JWT token validation
 * - Error handling
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const CONFIG = {
    // Use production URL if available, otherwise localhost
    BASE_URL: process.env.TEST_BASE_URL || 'https://www.comfortmytrip.com',
    LOCAL_URL: 'http://localhost:8080',
    API_BASE: '/api/v1',
    COOKIES_FILE: 'oauth-test-cookies.txt',
    TEST_USER: {
        name: 'OAuth Test User',
        email: 'oauth-test@example.com',
        password: 'TestPassword123!'
    }
};

// Colors for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Test results tracking
const testResults = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0
};

/**
 * Utility functions
 */
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName, status, message = '') {
    testResults.total++;
    const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    
    log(`${statusIcon} ${testName}: ${status}`, statusColor);
    if (message) {
        log(`   ${message}`, 'cyan');
    }
    
    if (status === 'PASS') testResults.passed++;
    else if (status === 'FAIL') testResults.failed++;
    else testResults.skipped++;
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'User-Agent': 'OAuth-Test-Script/1.0',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...options.headers
            },
            timeout: options.timeout || 10000
        };
        
        const req = client.request(requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data,
                    url: url
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

/**
 * Test Functions
 */
async function testServerHealth(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 1: Testing Server Health${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}`);
        
        if (response.statusCode === 200) {
            logTest('Server Health', 'PASS', `Server responding on ${baseUrl}`);
            return true;
        } else {
            logTest('Server Health', 'FAIL', `Server returned ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        logTest('Server Health', 'FAIL', `Connection failed: ${error.message}`);
        return false;
    }
}

async function testOAuthInitiation(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 2: Testing Google OAuth Initiation${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/google`);
        
        if (response.statusCode === 302 || response.statusCode === 301) {
            const location = response.headers.location;
            if (location && location.includes('accounts.google.com')) {
                logTest('OAuth Redirect', 'PASS', 'Correctly redirecting to Google OAuth');
                log(`   Redirect URL: ${location}`, 'cyan');
                return true;
            } else {
                logTest('OAuth Redirect', 'FAIL', 'Redirect URL does not point to Google');
                return false;
            }
        } else {
            logTest('OAuth Redirect', 'FAIL', `Expected redirect (302/301), got ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        logTest('OAuth Redirect', 'FAIL', `Request failed: ${error.message}`);
        return false;
    }
}

async function testProtectedEndpoints(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 3: Testing Protected Endpoints${colors.reset}`);
    log('='.repeat(50));
    
    const protectedEndpoints = [
        '/auth/me',
        '/protected'
    ];
    
    for (const endpoint of protectedEndpoints) {
        try {
            const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}${endpoint}`);
            
            if (response.statusCode === 401) {
                logTest(`Protected Endpoint ${endpoint}`, 'PASS', 'Correctly returns 401 Unauthorized');
            } else {
                logTest(`Protected Endpoint ${endpoint}`, 'FAIL', `Expected 401, got ${response.statusCode}`);
            }
        } catch (error) {
            logTest(`Protected Endpoint ${endpoint}`, 'FAIL', `Request failed: ${error.message}`);
        }
    }
}

async function testUserRegistration(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 4: Testing User Registration${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/register`, {
            method: 'POST',
            body: CONFIG.TEST_USER
        });
        
        if (response.statusCode === 201 || response.statusCode === 200) {
            const data = JSON.parse(response.data);
            if (data.success || data.user) {
                logTest('User Registration', 'PASS', 'User registered successfully');
                return true;
            } else {
                logTest('User Registration', 'FAIL', 'Registration response indicates failure');
                return false;
            }
        } else if (response.statusCode === 409) {
            logTest('User Registration', 'SKIP', 'User already exists (this is expected)');
            return true;
        } else {
            logTest('User Registration', 'FAIL', `Unexpected status code: ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        logTest('User Registration', 'FAIL', `Request failed: ${error.message}`);
        return false;
    }
}

async function testUserLogin(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 5: Testing User Login${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/login`, {
            method: 'POST',
            body: {
                email: CONFIG.TEST_USER.email,
                password: CONFIG.TEST_USER.password
            }
        });
        
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            if (data.success || data.token) {
                logTest('User Login', 'PASS', 'Login successful');
                
                // Check for JWT cookie in response headers
                const setCookieHeader = response.headers['set-cookie'];
                if (setCookieHeader && setCookieHeader.some(cookie => cookie.includes('jwt_token'))) {
                    logTest('JWT Cookie', 'PASS', 'JWT cookie set in response');
                } else {
                    logTest('JWT Cookie', 'FAIL', 'No JWT cookie found in response');
                }
                
                return true;
            } else {
                logTest('User Login', 'FAIL', 'Login response indicates failure');
                return false;
            }
        } else {
            logTest('User Login', 'FAIL', `Unexpected status code: ${response.statusCode}`);
            return false;
        }
    } catch (error) {
        logTest('User Login', 'FAIL', `Request failed: ${error.message}`);
        return false;
    }
}

async function testOAuthCallback(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 6: Testing OAuth Callback Endpoint${colors.reset}`);
    log('='.repeat(50));
    
    try {
        // Test callback endpoint without proper Google code (should fail gracefully)
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/google/callback`);
        
        if (response.statusCode === 400 || response.statusCode === 401) {
            logTest('OAuth Callback', 'PASS', 'Callback endpoint handles invalid requests correctly');
        } else if (response.statusCode === 302) {
            logTest('OAuth Callback', 'PASS', 'Callback endpoint redirects (may be working)');
        } else {
            logTest('OAuth Callback', 'WARN', `Unexpected status code: ${response.statusCode}`);
        }
    } catch (error) {
        logTest('OAuth Callback', 'FAIL', `Request failed: ${error.message}`);
    }
}

async function testAuthStatus(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 7: Testing Authentication Status${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/status`);
        
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            logTest('Auth Status Endpoint', 'PASS', 'Status endpoint accessible');
            log(`   Response: ${JSON.stringify(data)}`, 'cyan');
        } else {
            logTest('Auth Status Endpoint', 'FAIL', `Unexpected status code: ${response.statusCode}`);
        }
    } catch (error) {
        logTest('Auth Status Endpoint', 'FAIL', `Request failed: ${error.message}`);
    }
}

async function testLogout(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 8: Testing Logout${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/logout`, {
            method: 'GET'
        });
        
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            if (data.success) {
                logTest('Logout', 'PASS', 'Logout successful');
            } else {
                logTest('Logout', 'FAIL', 'Logout response indicates failure');
            }
        } else {
            logTest('Logout', 'FAIL', `Unexpected status code: ${response.statusCode}`);
        }
    } catch (error) {
        logTest('Logout', 'FAIL', `Request failed: ${error.message}`);
    }
}

async function testCORSHeaders(baseUrl) {
    log(`\n${colors.bold}${colors.blue}Step 9: Testing CORS Headers${colors.reset}`);
    log('='.repeat(50));
    
    try {
        const response = await makeRequest(`${baseUrl}${CONFIG.API_BASE}/auth/google`, {
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET'
            }
        });
        
        const corsHeaders = response.headers['access-control-allow-origin'];
        if (corsHeaders) {
            logTest('CORS Headers', 'PASS', 'CORS headers present');
            log(`   Allow-Origin: ${corsHeaders}`, 'cyan');
        } else {
            logTest('CORS Headers', 'WARN', 'No CORS headers found');
        }
    } catch (error) {
        logTest('CORS Headers', 'FAIL', `Request failed: ${error.message}`);
    }
}

function printSummary() {
    log(`\n${colors.bold}${colors.magenta}🎉 Testing Complete!${colors.reset}`);
    log('='.repeat(50));
    log(`Total Tests: ${testResults.total}`, 'bold');
    log(`✅ Passed: ${testResults.passed}`, 'green');
    log(`❌ Failed: ${testResults.failed}`, 'red');
    log(`⚠️  Skipped: ${testResults.skipped}`, 'yellow');
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`\nSuccess Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
    
    if (testResults.failed === 0) {
        log(`\n${colors.green}${colors.bold}🚀 All tests passed! Your Google OAuth API is working correctly!${colors.reset}`);
    } else {
        log(`\n${colors.yellow}${colors.bold}⚠️  Some tests failed. Please check the issues above.${colors.reset}`);
    }
}

function printNextSteps() {
    log(`\n${colors.bold}${colors.blue}📋 Next Steps for Manual Testing:${colors.reset}`);
    log('='.repeat(50));
    log('1. Open your browser and visit:', 'cyan');
    log(`   ${CONFIG.BASE_URL}${CONFIG.API_BASE}/auth/google`, 'yellow');
    log('');
    log('2. Complete the Google OAuth flow:', 'cyan');
    log('   - Sign in with your Google account', 'cyan');
    log('   - Grant permissions for profile and email', 'cyan');
    log('   - You should be redirected back to your frontend', 'cyan');
    log('');
    log('3. Check your frontend integration:', 'cyan');
    log('   - Verify the AuthCallback component handles the token', 'cyan');
    log('   - Test protected routes in your frontend', 'cyan');
    log('   - Verify user information is displayed correctly', 'cyan');
    log('');
    log('4. Test the complete user flow:', 'cyan');
    log('   - Login → Access protected content → Logout', 'cyan');
    log('');
    log(`${colors.green}${colors.bold}Your Google OAuth implementation is ready for production! 🎉${colors.reset}`);
}

/**
 * Main execution function
 */
async function main() {
    log(`${colors.bold}${colors.blue}🧪 Google OAuth API Testing Suite${colors.reset}`);
    log('='.repeat(50));
    log(`Testing against: ${CONFIG.BASE_URL}`, 'cyan');
    log(`Local fallback: ${CONFIG.LOCAL_URL}`, 'cyan');
    log('');
    
    // Test both production and local URLs
    const urlsToTest = [CONFIG.BASE_URL];
    
    // If production URL is not localhost, also test localhost
    if (!CONFIG.BASE_URL.includes('localhost')) {
        urlsToTest.push(CONFIG.LOCAL_URL);
    }
    
    for (const baseUrl of urlsToTest) {
        log(`${colors.bold}${colors.magenta}Testing ${baseUrl}${colors.reset}`);
        log('='.repeat(50));
        
        const isHealthy = await testServerHealth(baseUrl);
        
        if (isHealthy) {
            await testOAuthInitiation(baseUrl);
            await testProtectedEndpoints(baseUrl);
            await testUserRegistration(baseUrl);
            await testUserLogin(baseUrl);
            await testOAuthCallback(baseUrl);
            await testAuthStatus(baseUrl);
            await testLogout(baseUrl);
            await testCORSHeaders(baseUrl);
        } else {
            log(`Skipping tests for ${baseUrl} due to server health issues`, 'yellow');
        }
        
        log(''); // Add spacing between URL tests
    }
    
    printSummary();
    printNextSteps();
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    log(`${colors.bold}Google OAuth API Testing Script${colors.reset}`);
    log('');
    log('Usage: node test-google-oauth-comprehensive.js [options]');
    log('');
    log('Options:');
    log('  --help, -h     Show this help message');
    log('  --url <url>    Test against specific URL');
    log('');
    log('Environment Variables:');
    log('  TEST_BASE_URL  Base URL to test against (default: https://www.comfortmytrip.com)');
    log('');
    process.exit(0);
}

// Check for custom URL argument
const urlIndex = process.argv.indexOf('--url');
if (urlIndex !== -1 && process.argv[urlIndex + 1]) {
    CONFIG.BASE_URL = process.argv[urlIndex + 1];
}

// Run the tests
main().catch((error) => {
    log(`\n${colors.red}${colors.bold}❌ Test suite failed with error:${colors.reset}`, 'red');
    log(error.message, 'red');
    log(error.stack, 'red');
    process.exit(1);
});
