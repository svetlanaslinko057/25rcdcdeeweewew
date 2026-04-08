#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class DevelopmentOSAPITester:
    def __init__(self, base_url="https://auth-platform-20.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            self.results.append({
                'test': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_preview': response.text[:200] if response.text else ''
            })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.results.append({
                'test': name,
                'method': method,
                'endpoint': endpoint,
                'expected_status': expected_status,
                'actual_status': 'ERROR',
                'success': False,
                'error': str(e)
            })
            return False, {}

    def test_api_version(self):
        """Test GET /api/ - should return version"""
        return self.run_test(
            "API Version",
            "GET",
            "",
            200
        )

    def test_platform_stats(self):
        """Test GET /api/stats - should return platform statistics"""
        return self.run_test(
            "Platform Stats",
            "GET", 
            "stats",
            200
        )

    def test_portfolio_cases(self):
        """Test GET /api/portfolio/cases - should return portfolio cases"""
        return self.run_test(
            "Portfolio Cases",
            "GET",
            "portfolio/cases", 
            200
        )

    def test_featured_cases(self):
        """Test GET /api/portfolio/featured - should return featured cases"""
        return self.run_test(
            "Featured Portfolio Cases",
            "GET",
            "portfolio/featured",
            200
        )

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 TEST SUMMARY")
        print(f"="*60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        if self.tests_run - self.tests_passed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    error_msg = result.get('error', f"Expected {result['expected_status']}, got {result['actual_status']}")
                    print(f"   - {result['test']}: {error_msg}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Development OS API Testing...")
    print("="*60)
    
    tester = DevelopmentOSAPITester()
    
    # Test public endpoints that should work without authentication
    print("\n📋 Testing Public API Endpoints...")
    
    # Test API version endpoint
    tester.test_api_version()
    
    # Test platform stats
    tester.test_platform_stats()
    
    # Test portfolio endpoints
    tester.test_portfolio_cases()
    tester.test_featured_cases()
    
    # Print final summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())