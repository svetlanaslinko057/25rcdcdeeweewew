#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class AdminAPITester:
    def __init__(self, base_url="https://auth-platform-20.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []
        self.session = requests.Session()
        self.admin_user = None
        self.test_work_unit_id = None

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
                response = self.session.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:300]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")

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

    def login_as_admin(self):
        """Login as admin user"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/quick",
            200,
            data={
                "email": "admin@devos.io",
                "role": "admin"
            }
        )
        
        if success and not response.get("isNew"):
            self.admin_user = response.get("user")
            print(f"   ✅ Admin logged in successfully")
            return True
        else:
            print(f"   ❌ Admin login failed or admin user doesn't exist")
            return False

    def test_admin_endpoints(self):
        """Test admin-specific endpoints"""
        # Test get all users
        success, users = self.run_test(
            "Get All Users (Admin)",
            "GET",
            "admin/users",
            200
        )
        
        if not success:
            return False
            
        # Test get developers
        success, developers = self.run_test(
            "Get Developers (Admin)",
            "GET", 
            "admin/developers",
            200
        )
        
        if not success:
            return False
            
        # Test get requests
        success, requests_data = self.run_test(
            "Get All Requests (Admin)",
            "GET",
            "admin/requests", 
            200
        )
        
        if not success:
            return False
            
        # Test get projects
        success, projects = self.run_test(
            "Get All Projects (Admin)",
            "GET",
            "admin/projects",
            200
        )
        
        if not success:
            return False
            
        # Test get work units
        success, work_units = self.run_test(
            "Get All Work Units (Admin)",
            "GET",
            "admin/work-units",
            200
        )
        
        if success and work_units:
            # Store a work unit ID for assignment testing
            self.test_work_unit_id = work_units[0].get('unit_id')
            
        return success

    def test_assignment_engine(self):
        """Test assignment engine endpoints"""
        if not self.test_work_unit_id:
            print("❌ No work unit ID available for assignment testing")
            return False
            
        # Test get candidates
        success, candidates = self.run_test(
            "Get Assignment Candidates",
            "GET",
            f"admin/assignment-engine/{self.test_work_unit_id}/candidates",
            200
        )
        
        if not success:
            return False
            
        # Test assign best match
        success, response = self.run_test(
            "Assign Best Match",
            "POST",
            f"admin/assignment-engine/{self.test_work_unit_id}/assign-best",
            200
        )
        
        return success

    def test_deliverable_creation(self):
        """Test deliverable creation"""
        # First create a test project if none exists
        success, projects = self.run_test(
            "Get Projects for Deliverable Test",
            "GET",
            "admin/projects",
            200
        )
        
        if not success:
            return False
            
        if not projects:
            print("   ⚠️  No projects available for deliverable testing")
            return True  # Not a failure, just no data
            
        project_id = projects[0].get('project_id')
        
        # Test create deliverable
        success, response = self.run_test(
            "Create Deliverable",
            "POST",
            "admin/deliverable",
            200,
            data={
                "project_id": project_id,
                "title": "Test Deliverable",
                "description": "A test deliverable for API testing",
                "links": ["https://example.com/demo"],
                "work_unit_ids": []
            }
        )
        
        return success

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 ADMIN API TEST SUMMARY")
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
    print("🚀 Starting Admin API Testing...")
    print("="*60)
    
    tester = AdminAPITester()
    
    # Login as admin
    if not tester.login_as_admin():
        print("❌ Cannot proceed without admin access")
        return 1
    
    # Test admin endpoints
    print("\n👑 Testing Admin Endpoints...")
    tester.test_admin_endpoints()
    
    # Test assignment engine
    print("\n🎯 Testing Assignment Engine...")
    tester.test_assignment_engine()
    
    # Test deliverable creation
    print("\n📦 Testing Deliverable Creation...")
    tester.test_deliverable_creation()
    
    # Print summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())