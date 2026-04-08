#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class DevelopmentOSAPITester:
    def __init__(self, base_url="https://auth-platform-20.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.session = requests.Session()  # For cookie management
        self.current_user = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_session=True):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            # Use session for cookie management or regular requests
            client = self.session if use_session else requests
            
            if method == 'GET':
                response = client.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = client.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = client.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = client.delete(url, headers=headers, timeout=10)

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
            200,
            use_session=False
        )

    # ============ AUTH TESTS ============
    
    def test_quick_auth_new_user(self):
        """Test POST /api/auth/quick with new user"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        success, response = self.run_test(
            "Quick Auth - New User",
            "POST",
            "auth/quick",
            200,
            data={
                "email": test_email,
                "role": "client"
            }
        )
        
        if success and response.get("isNew"):
            print(f"   ✅ New user detected correctly")
            return True, test_email
        elif success:
            print(f"   ❌ Expected new user but got existing user")
            return False, test_email
        return False, test_email

    def test_onboarding_flow(self, email):
        """Test POST /api/auth/onboarding"""
        success, response = self.run_test(
            "Complete Onboarding",
            "POST", 
            "auth/onboarding",
            200,
            data={
                "email": email,
                "name": "Test User",
                "role": "client",
                "company": "Test Company"
            }
        )
        
        if success and response.get("user_id"):
            self.current_user = response
            print(f"   ✅ User created with ID: {response['user_id']}")
            return True
        return False

    def test_auth_me(self):
        """Test GET /api/auth/me - should return current user"""
        return self.run_test(
            "Get Current User",
            "GET",
            "auth/me", 
            200
        )

    def test_quick_auth_existing_user(self):
        """Test POST /api/auth/quick with existing user"""
        if not self.current_user:
            print("❌ No current user for existing user test")
            return False, None
            
        success, response = self.run_test(
            "Quick Auth - Existing User",
            "POST",
            "auth/quick",
            200,
            data={
                "email": self.current_user["email"],
                "role": "client"
            }
        )
        
        if success and not response.get("isNew"):
            print(f"   ✅ Existing user detected correctly")
            return True
        elif success:
            print(f"   ❌ Expected existing user but got new user")
            return False
        return False

    def test_register_login_flow(self):
        """Test new register/login flow"""
        test_email = f"dev_{uuid.uuid4().hex[:8]}@example.com"
        
        # Test registration
        success, response = self.run_test(
            "Register Developer",
            "POST",
            "auth/register",
            200,
            data={
                "email": test_email,
                "password": "TestPass123!",
                "name": "Test Developer",
                "role": "developer",
                "skills": ["React", "Node.js"],
                "specialization": "fullstack"
            }
        )
        
        if not success or not response.get("user_id"):
            return False
            
        # Test login with same credentials
        success, response = self.run_test(
            "Login Developer",
            "POST",
            "auth/login",
            200,
            data={
                "email": test_email,
                "password": "TestPass123!"
            }
        )
        
        return success and response.get("role") == "developer"

    def test_demo_access_flows(self):
        """Test demo access for all roles"""
        roles = ["client", "developer", "tester", "admin"]
        all_success = True
        
        for role in roles:
            success, response = self.run_test(
                f"Demo Access - {role.title()}",
                "POST",
                "auth/demo",
                200,
                data={"role": role}
            )
            
            if success and response.get("role") == role and response.get("is_demo"):
                print(f"   ✅ Demo {role} created successfully")
            else:
                print(f"   ❌ Demo {role} failed")
                all_success = False
                
        return all_success

    def test_tester_auth_flow(self):
        """Test tester auth flow"""
        test_email = f"tester_{uuid.uuid4().hex[:8]}@example.com"
        
        # Test quick auth for tester
        success, response = self.run_test(
            "Tester Quick Auth",
            "POST",
            "auth/quick",
            200,
            data={
                "email": test_email,
                "role": "tester",
                "skill": "tester"
            }
        )
        
        if not success or not response.get("isNew"):
            return False
            
        # Test onboarding for tester
        success, response = self.run_test(
            "Tester Onboarding",
            "POST",
            "auth/onboarding",
            200,
            data={
                "email": test_email,
                "name": "Test Tester",
                "role": "tester",
                "skills": ["tester"]
            }
        )
        
        return success and response.get("role") == "tester"

    # ============ PROTECTED ENDPOINT TESTS ============
    
    def test_create_request(self):
        """Test POST /api/requests - create new project request"""
        if not self.current_user:
            print("❌ No authenticated user for request creation")
            return False
            
        success, response = self.run_test(
            "Create Project Request",
            "POST",
            "requests",
            200,
            data={
                "title": "Test Project",
                "description": "A test project for API testing",
                "business_idea": "Building a test application to validate the platform"
            }
        )
        
        if success and response.get("request_id"):
            print(f"   ✅ Request created with ID: {response['request_id']}")
            return True
        return False

    def test_get_my_requests(self):
        """Test GET /api/requests - get user's requests"""
        return self.run_test(
            "Get My Requests",
            "GET",
            "requests",
            200
        )

    def test_get_my_projects(self):
        """Test GET /api/projects/mine - get user's projects"""
        return self.run_test(
            "Get My Projects", 
            "GET",
            "projects/mine",
            200
        )

    def test_logout(self):
        """Test POST /api/auth/logout"""
        success, response = self.run_test(
            "Logout",
            "POST",
            "auth/logout",
            200
        )
        
        if success:
            self.current_user = None
            print(f"   ✅ User logged out successfully")
        return success

    def test_unauthorized_access(self):
        """Test that protected endpoints require authentication after logout"""
        success, response = self.run_test(
            "Unauthorized Access Check",
            "GET",
            "auth/me",
            401  # Should be unauthorized
        )
        
        if success:
            print(f"   ✅ Properly blocked unauthorized access")
        return success

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
    
    # Test authentication flows
    print("\n🔐 Testing Authentication Flows...")
    
    # Test new user registration flow
    auth_success, test_email = tester.test_quick_auth_new_user()
    if auth_success:
        onboarding_success = tester.test_onboarding_flow(test_email)
        if onboarding_success:
            # Test authenticated endpoints
            print("\n🔒 Testing Protected Endpoints...")
            tester.test_auth_me()
            tester.test_create_request()
            tester.test_get_my_requests()
            tester.test_get_my_projects()
            
            # Test existing user flow
            tester.test_quick_auth_existing_user()
            
            # Test logout
            tester.test_logout()
            
            # Test unauthorized access
            tester.test_unauthorized_access()
    
    # Test builder auth flows
    print("\n👨‍💻 Testing New Auth Flows...")
    tester.test_register_login_flow()
    tester.test_demo_access_flows()
    
    # Print final summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())