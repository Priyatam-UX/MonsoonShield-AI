import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple Node-based test client execution
const TEST_PORT = 5005;

async function runTests() {
  console.log('--- Starting Express Route & Security Headers Integration Tests ---');
  
  // Import our server config directly to boot up the test container
  // We mock process.env variables for testing
  process.env.PORT = String(TEST_PORT);
  
  // We dynamic import the index server to start listening
  const serverModule = require('../index');
  
  // Give the server 1.5 seconds to start listening
  await new Promise(resolve => setTimeout(resolve, 1500));

  const baseUrl = `http://localhost:${TEST_PORT}`;
  let testsFailed = 0;

  // Helper assertions
  const assert = (condition: boolean, message: string) => {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      testsFailed++;
    } else {
      console.log(`✅ PASSED: ${message}`);
    }
  };

  try {
    // Test 1: Verify weather endpoint and security headers
    console.log('\nRunning Test 1: Verification of weather telemetry and security headers...');
    const weatherRes = await fetch(`${baseUrl}/api/weather`);
    assert(weatherRes.status === 200, 'Weather endpoint returned status 200');

    const headers = weatherRes.headers;
    assert(headers.get('x-frame-options') === 'DENY', 'Security Header X-Frame-Options is DENY');
    assert(headers.get('x-content-type-options') === 'nosniff', 'Security Header X-Content-Type-Options is nosniff');
    assert(headers.get('content-security-policy') !== null, 'Content-Security-Policy header is configured');

    const weatherJson = await weatherRes.json();
    assert(weatherJson.temp === 26.5, 'Weather payload has temperature metrics');
    assert(Array.isArray(weatherJson.alerts), 'Weather payload has alerts array');

    // Test 2: Verify AI fallback response format
    console.log('\nRunning Test 2: AI Prompt fallback evaluation...');
    const aiRes = await fetch(`${baseUrl}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'morningChecklist riskScore' })
    });
    assert(aiRes.status === 200, 'AI chat route returned status 200');
    
    const aiJson = await aiRes.json();
    const payload = JSON.parse(aiJson.text);
    assert(payload.riskScore === 82, 'Planner fallback returns custom score');
    assert(Array.isArray(payload.morningChecklist), 'Planner fallback has morningChecklist array');

    // Test 3: Verify Rate Limiter trigger conditions (25 requests / min limit)
    console.log('\nRunning Test 3: Rate Limiter enforcement check (firing 30 requests)...');
    let hitRateLimit = false;
    for (let i = 0; i < 30; i++) {
      const limitRes = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' })
      });
      if (limitRes.status === 429) {
        hitRateLimit = true;
        break;
      }
    }
    assert(hitRateLimit, 'Rate limiter correctly triggered a 429 status on consecutive requests');

  } catch (err: any) {
    console.error('Test execution error:', err.message);
    testsFailed++;
  }

  console.log('\n--- Test Execution Summary ---');
  if (testsFailed > 0) {
    console.error(`Test run completed with ${testsFailed} failure(s).`);
    process.exit(1);
  } else {
    console.log('All backend integration and security test assertions passed successfully!');
    process.exit(0);
  }
}

// Execute tests
runTests();
